import os
import json
import time
import logging
import pandas as pd
import gspread
from typing import List, Optional
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.service_account import Credentials
from pydantic import BaseModel

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TransactionModel(BaseModel):
    id: int
    date: str
    tipo: str
    categoria: str
    coluna_1: str
    valor: float
    observacao: str

class GoogleSheetsService:
    def __init__(self, cache_ttl_seconds: int = 300):
        self._client = None
        self._cache_data = None
        self._cache_timestamp = 0.0
        self.cache_ttl = cache_ttl_seconds

    def _get_client(self) -> gspread.Client:
        if self._client is None:
            creds_json = os.getenv("GOOGLE_CREDS")
            if not creds_json:
                raise ValueError("Variável GOOGLE_CREDS não configurada no Vercel")

            creds_dict = json.loads(creds_json)
            creds = Credentials.from_service_account_info(
                creds_dict,
                scopes=["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
            )
            self._client = gspread.authorize(creds)
        return self._client

    def parse_money_caec(self, val) -> float:
        if pd.isna(val) or str(val).strip() == "": return 0.0
        s = str(val).strip().replace("R$", "").replace(".", "").replace(",", ".").replace(" ", "")
        try:
            return float(s)
        except:
            return 0.0

    def fetch_data(self) -> List[dict]:
        now = time.time()
        if self._cache_data and (now - self._cache_timestamp) < self.cache_ttl:
            return self._cache_data

        data = self._process()
        self._cache_data = data
        self._cache_timestamp = now
        return data

    def _process(self) -> List[dict]:
        client = self._get_client()
        sh = client.open(os.getenv("SPREADSHEET_NAME"))
        ws = sh.get_worksheet(int(os.getenv("WORKSHEET_INDEX", 0))) # Vercel usa índice base 0 geralmente

        values = ws.get_all_values()
        if not values: return []

        header_idx = 0
        for i, row in enumerate(values[:10]):
            if "DATA" in [str(c).upper() for c in row]:
                header_idx = i
                break

        headers = [str(h).strip() for h in values[header_idx]]
        df = pd.DataFrame(values[header_idx + 1:], columns=headers)
        df["VALOR_NUM"] = df["VALOR"].apply(self.parse_money_caec)

        result = []
        for i, row in df.iterrows():
            val = row["VALOR_NUM"]
            tipo_str = str(row.get("TIPO", "")).upper()

            result.append({
                "id": int(i),
                "date": str(row["DATA"]),
                "tipo": "DESPESA" if "DESPESA" in tipo_str else "RECEITA",
                "categoria": str(row.get("CATEGORIA", "N/D")),
                "coluna_1": str(row.get("Coluna 1", "N/D")),
                "valor": float(abs(val)),
                "observacao": str(row.get("OBSERVAÇÃO", "N/D")),
            })
        return result

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

service = GoogleSheetsService()

@app.get("/api/data", response_model=List[TransactionModel])
async def get_data():
    return service.fetch_data()

@app.get("/api/health")
def health():
    return {"status": "online", "provider": "vercel"}

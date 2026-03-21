from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.compare import router as compare_router
from routers.search import router as search_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compare_router)
app.include_router(search_router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

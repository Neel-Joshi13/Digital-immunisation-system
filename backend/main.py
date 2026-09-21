from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html

from routers.users import router as users_router
from routers.auth import router as auth_router
from routers.patients import router as patients_router
from routers.vaccines import router as vaccines_router
from routers.immunisations import router as immunisations_router
from routers.appointments import router as appointments_router
from routers.healthcare_care import router as centres_router
from routers.ai import router as ai_router
from routers.vaccination_schedules import router as vaccination_schedule_router
from routers.certificates import router as certificates_router
from routers import notifications
from routers import audit_logs
from routers import login_history


app = FastAPI(
    title="Digital Immunisation API",
    version="1.0.0",
    docs_url=None
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://10.80.224.214:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui():

    swagger_html = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="Digital Immunisation API - Swagger"
    )

    html = swagger_html.body.decode("utf-8")

    html = html.replace(
        "</head>",
        """
        <link
            rel="stylesheet"
            type="text/css"
            href="/static/swagger.css"
        />
        </head>
        """
    )

    return HTMLResponse(
        content=html
    )


app.include_router(users_router)

app.include_router(auth_router)

app.include_router(patients_router)

app.include_router(vaccines_router)

app.include_router(immunisations_router)

app.include_router(appointments_router)

app.include_router(centres_router)

app.include_router(ai_router)

app.include_router(vaccination_schedule_router)

app.include_router(certificates_router)

app.include_router(notifications.router)

app.include_router(audit_logs.router)

app.include_router(login_history.router)


@app.get("/")
def root():

    return {
        "message": "Digital Immunisation API is running"
    }


@app.get("/health")
def health_check():

    return {
        "status": "Healthy"
    }
"""
GovConnect Documents API Routes
Manages citizen evidentiary document records and integrates with Sangharsh's Document AI for OCR verification.
"""

from typing import Any, Dict, List, Optional
import uuid
from fastapi import APIRouter, HTTPException, status
from database import db
from schemas import DocumentCreate, DocumentVerificationCreate, DocumentResponse, ApiResponse

router = APIRouter(prefix="/api/documents", tags=["Documents & Verification"])


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def upload_document_metadata(doc_input: DocumentCreate) -> ApiResponse:
    """
    Register an uploaded document metadata in the user's DigiLocker vault.
    (Files are uploaded to Supabase Storage, and their URLs/metadata are saved here).
    """
    user = db.get_user_by_id(doc_input.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{doc_input.user_id}' does not exist."
        )

    document_id = doc_input.document_id or f"doc-{uuid.uuid4().hex[:8]}"
    doc_data = doc_input.model_dump()
    doc_data["document_id"] = document_id

    created_doc = db.create_document(doc_data)

    return ApiResponse(
        status="success",
        message="Document metadata registered successfully.",
        data=created_doc
    )


@router.get("/{user_id}", response_model=ApiResponse)
def get_user_documents(user_id: str) -> ApiResponse:
    """
    Get all uploaded documents for a citizen, enriched with OCR/AI verification status and extracted fields.
    """
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found."
        )

    documents = db.get_documents_by_user(user_id)

    return ApiResponse(
        status="success",
        data={"documents": documents, "count": len(documents)}
    )


@router.get("/detail/{document_id}", response_model=ApiResponse)
def get_document_detail(document_id: str) -> ApiResponse:
    """
    Get specific document details and verification audit history.
    """
    doc = db.get_document_by_id(document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{document_id}' not found."
        )

    return ApiResponse(
        status="success",
        data=doc
    )


@router.post("/{document_id}/verify", response_model=ApiResponse)
def submit_document_verification(document_id: str, verif_input: DocumentVerificationCreate) -> ApiResponse:
    """
    Integration endpoint for Document AI (Sangharsh):
    Receives OCR extracted fields, confidence scores, and mismatch/fraud flags,
    persisting them to document_verifications and updating the document status.
    """
    doc = db.get_document_by_id(document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{document_id}' not found."
        )

    verif_id = verif_input.verification_id or f"verif-{uuid.uuid4().hex[:8]}"
    verif_data = verif_input.model_dump()
    verif_data["verification_id"] = verif_id
    verif_data["document_id"] = document_id

    saved_verif = db.save_verification_result(verif_data)

    return ApiResponse(
        status="success",
        message="Document verification result processed and recorded.",
        data={
            "verification": saved_verif,
            "document_id": document_id,
            "updated_status": "verified" if verif_input.matched else "mismatch"
        }
    )

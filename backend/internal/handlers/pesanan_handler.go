package handlers

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PesananHandler interface {
	List(c *gin.Context)
	GetDetail(c *gin.Context)
	Subtotal(c *gin.Context)
	Create(c *gin.Context)
}

type pesananHandler struct {
	svc services.PesananService
}

func NewPesananHandler(svc services.PesananService) PesananHandler {
	return &pesananHandler{svc: svc}
}

func (h *pesananHandler) List(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	status := c.Query("status")
	resp, err := h.svc.List(c.Request.Context(), id, status)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *pesananHandler) GetDetail(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	pesananID, ok := parsePathInt(c, "pesananId")
	if !ok {
		return
	}
	resp, err := h.svc.GetDetail(c.Request.Context(), id, pesananID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

// Subtotal accepts either a JSON body (POST-style preview) or a query param `items`
// containing a JSON-encoded array of ItemPesananInput. We keep it as GET so the
// frontend client.ts wrapper can call it without modification.
func (h *pesananHandler) Subtotal(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	itemsRaw := c.Query("items")
	if itemsRaw == "" {
		common.Fail(c, http.StatusBadRequest, "items query param required")
		return
	}
	var items []dtos.ItemPesananInput
	if err := json.Unmarshal([]byte(itemsRaw), &items); err != nil {
		common.Fail(c, http.StatusBadRequest, "invalid items: "+err.Error())
		return
	}
	resp, err := h.svc.Subtotal(c.Request.Context(), items)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *pesananHandler) Create(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	var req dtos.CreatePesananRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.svc.Create(c.Request.Context(), id, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusCreated, resp)
}

package handlers

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UlasanHandler interface {
	ListMine(c *gin.Context)
	GetByPesanan(c *gin.Context)
	Create(c *gin.Context)
}

type ulasanHandler struct {
	svc services.UlasanService
}

func NewUlasanHandler(svc services.UlasanService) UlasanHandler {
	return &ulasanHandler{svc: svc}
}

func (h *ulasanHandler) ListMine(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	resp, err := h.svc.ListMine(c.Request.Context(), id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *ulasanHandler) GetByPesanan(c *gin.Context) {
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
	resp, err := h.svc.GetByPesanan(c.Request.Context(), id, pesananID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *ulasanHandler) Create(c *gin.Context) {
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
	var req dtos.CreateUlasanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.svc.Create(c.Request.Context(), id, pesananID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusCreated, resp)
}

package handlers

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PembayaranHandler interface {
	Konfirmasi(c *gin.Context)
}

type pembayaranHandler struct {
	svc services.PembayaranService
}

func NewPembayaranHandler(svc services.PembayaranService) PembayaranHandler {
	return &pembayaranHandler{svc: svc}
}

func (h *pembayaranHandler) Konfirmasi(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	var req dtos.KonfirmasiPembayaranRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.svc.Konfirmasi(c.Request.Context(), id, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

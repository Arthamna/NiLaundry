package handlers

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"arthamna/NiLaundry/pkg/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PelangganHandler interface {
	GetMe(c *gin.Context)
	UpdateMe(c *gin.Context)
}

type pelangganHandler struct {
	svc services.PelangganService
}

func NewPelangganHandler(svc services.PelangganService) PelangganHandler {
	return &pelangganHandler{svc: svc}
}

func (h *pelangganHandler) GetMe(c *gin.Context) {
	id := middleware.GetPelangganID(c)
	resp, err := h.svc.GetMe(c.Request.Context(), id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *pelangganHandler) UpdateMe(c *gin.Context) {
	id := middleware.GetPelangganID(c)
	var req dtos.UpdatePelangganRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.svc.UpdateMe(c.Request.Context(), id, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

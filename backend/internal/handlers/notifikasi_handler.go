package handlers

import (
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"net/http"

	"github.com/gin-gonic/gin"
)

type NotifikasiHandler interface {
	List(c *gin.Context)
}

type notifikasiHandler struct {
	svc services.NotifikasiService
}

func NewNotifikasiHandler(svc services.NotifikasiService) NotifikasiHandler {
	return &notifikasiHandler{svc: svc}
}

func (h *notifikasiHandler) List(c *gin.Context) {
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

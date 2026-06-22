package handlers

import (
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"net/http"

	"github.com/gin-gonic/gin"
)

type KurirHandler interface {
	List(c *gin.Context)
}

type kurirHandler struct {
	svc services.KurirService
}

func NewKurirHandler(svc services.KurirService) KurirHandler {
	return &kurirHandler{svc: svc}
}

func (h *kurirHandler) List(c *gin.Context) {
	// Ownership is already enforced by RequirePelanggan; we still validate
	// the path id is numeric so URL noise (`/pelanggan/abc/kurir`) returns 400.
	if _, ok := parsePathInt(c, "id"); !ok {
		return
	}
	page := intQuery(c, "page", 1)
	limit := intQuery(c, "limit", 50)
	resp, err := h.svc.List(c.Request.Context(), page, limit)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

package handlers

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"net/http"

	"github.com/gin-gonic/gin"
)

type VoucherHandler interface {
	List(c *gin.Context)
	TotalHemat(c *gin.Context)
	Claim(c *gin.Context)
}

type voucherHandler struct {
	svc services.VoucherService
}

func NewVoucherHandler(svc services.VoucherService) VoucherHandler {
	return &voucherHandler{svc: svc}
}

func (h *voucherHandler) List(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	scopeRaw := c.Query("scope")
	scope := services.VoucherScopeAvailable
	if scopeRaw == string(services.VoucherScopeOwned) {
		scope = services.VoucherScopeOwned
	}
	resp, err := h.svc.List(c.Request.Context(), id, scope)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *voucherHandler) TotalHemat(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	resp, err := h.svc.TotalHemat(c.Request.Context(), id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *voucherHandler) Claim(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	if !requireOwnership(c, id) {
		return
	}
	var req dtos.ClaimVoucherRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.svc.Claim(c.Request.Context(), id, req.Kode)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusCreated, resp)
}

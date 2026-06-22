package handlers

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BranchHandler interface {
	// Dashboard
	OrderStatistik(c *gin.Context)
	ListOrders(c *gin.Context)
	RecentPayments(c *gin.Context)
	RecentReviews(c *gin.Context)

	// Orders
	OrderStatusStatistik(c *gin.Context)
	OrderDetail(c *gin.Context)
	UpdateOrderDetail(c *gin.Context)

	// Reports
	PaymentByCustomer(c *gin.Context)
	PaymentMethodChart(c *gin.Context)
	PaymentMethodTotal(c *gin.Context)
	PaymentMethodAverage(c *gin.Context)

	// Reviews
	ListUlasan(c *gin.Context)
	UlasanDistribusi(c *gin.Context)
	UlasanAverage(c *gin.Context)

	// Staff
	ListPegawai(c *gin.Context)
}

type branchHandler struct {
	svc services.BranchService
}

func NewBranchHandler(svc services.BranchService) BranchHandler {
	return &branchHandler{svc: svc}
}

// helpers --------------------------------------------------------------------

func (h *branchHandler) cabang(c *gin.Context) (int, bool) {
	return parsePathInt(c, "cabangId")
}

func (h *branchHandler) pesanan(c *gin.Context) (int, bool) {
	return parsePathInt(c, "pesananId")
}

func intQuery(c *gin.Context, key string, def int) int {
	raw := c.Query(key)
	if raw == "" {
		return def
	}
	v, err := strconv.Atoi(raw)
	if err != nil {
		return def
	}
	return v
}

// Dashboard ------------------------------------------------------------------

func (h *branchHandler) OrderStatistik(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.OrderStatistik(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) ListOrders(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	page := intQuery(c, "page", 1)
	limit := intQuery(c, "limit", 50)
	if page < 1 {
		page = 1
	}
	if limit <= 0 {
		limit = 50
	}
	params := repositories.ListOrdersParams{
		Status: c.Query("status"),
		Search: c.Query("search"),
		Sort:   c.Query("sort"),
		Limit:  limit,
		Offset: (page - 1) * limit,
	}
	resp, err := h.svc.ListOrders(c.Request.Context(), cab, params)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) RecentPayments(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	limit := intQuery(c, "limit", 50)
	resp, err := h.svc.RecentPayments(c.Request.Context(), cab, limit)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) RecentReviews(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	limit := intQuery(c, "limit", 50)
	resp, err := h.svc.RecentReviews(c.Request.Context(), cab, limit)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

// Orders ---------------------------------------------------------------------

func (h *branchHandler) OrderStatusStatistik(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.OrderStatusStatistik(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) OrderDetail(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	pes, ok := h.pesanan(c)
	if !ok {
		return
	}
	resp, err := h.svc.OrderDetail(c.Request.Context(), cab, pes)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) UpdateOrderDetail(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	pes, ok := h.pesanan(c)
	if !ok {
		return
	}
	var req dtos.UpdateOrderDetailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.svc.UpdateOrderDetail(c.Request.Context(), cab, pes, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

// Reports --------------------------------------------------------------------

func (h *branchHandler) PaymentByCustomer(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.PaymentByCustomer(c.Request.Context(), cab, intQuery(c, "page", 1), intQuery(c, "limit", 20))
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) PaymentMethodChart(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.PaymentMethodChart(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) PaymentMethodTotal(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.PaymentMethodTotal(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) PaymentMethodAverage(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.PaymentMethodAverage(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

// Reviews --------------------------------------------------------------------

func (h *branchHandler) ListUlasan(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.ListUlasan(c.Request.Context(), cab, intQuery(c, "page", 1), intQuery(c, "limit", 20))
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) UlasanDistribusi(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.UlasanDistribusi(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

func (h *branchHandler) UlasanAverage(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.UlasanAverage(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

// Staff ----------------------------------------------------------------------

func (h *branchHandler) ListPegawai(c *gin.Context) {
	cab, ok := h.cabang(c)
	if !ok {
		return
	}
	resp, err := h.svc.ListPegawai(c.Request.Context(), cab)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, resp)
}

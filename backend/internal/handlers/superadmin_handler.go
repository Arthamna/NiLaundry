package handlers

import (
	"arthamna/NiLaundry/internal/dtos"
	"arthamna/NiLaundry/internal/services"
	"arthamna/NiLaundry/pkg/common"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SuperadminHandler interface {
	// Dashboard
	StatistikUmum(c *gin.Context)
	StatistikLayanan(c *gin.Context) // top 6
	StatistikLiveOrders(c *gin.Context)
	StatistikCabangTop(c *gin.Context)
	StatistikPembayaran(c *gin.Context)

	// Orders
	ListPesanan(c *gin.Context)
	OrdersStats(c *gin.Context)

	// Services
	ListServices(c *gin.Context)

	// Vouchers
	ListVouchers(c *gin.Context)
	VouchersStatistik(c *gin.Context)
	CreateVoucher(c *gin.Context)
	GetVoucher(c *gin.Context)
	UpdateVoucher(c *gin.Context)
	DeleteVoucher(c *gin.Context)

	// Staffs
	ListPegawai(c *gin.Context)
	CreatePegawai(c *gin.Context)
	UpdatePegawai(c *gin.Context)
	DeletePegawai(c *gin.Context)

	// Couriers
	ListKurir(c *gin.Context)
	CreateKurir(c *gin.Context)
	UpdateKurir(c *gin.Context)
	DeleteKurir(c *gin.Context)
	ListTipeKendaraan(c *gin.Context)

	// Branches
	ListCabang(c *gin.Context)
	GetCabang(c *gin.Context)
	DeleteCabang(c *gin.Context)
	BranchPerformance(c *gin.Context)
	BranchServices(c *gin.Context)
	BranchReviews(c *gin.Context)
	CreateCabang(c *gin.Context)
	UpdateCabang(c *gin.Context)
	CreateTarif(c *gin.Context)
	UpdateTarif(c *gin.Context)

	// Payments
	ListPayments(c *gin.Context)
	PaymentByCustomerForCabang(c *gin.Context)

	// Customers
	ListCustomers(c *gin.Context)
	GetCustomer(c *gin.Context)

	// Catalog
	ListLayanan(c *gin.Context)
}

type superadminHandler struct {
	svc services.SuperadminService
}

func NewSuperadminHandler(svc services.SuperadminService) SuperadminHandler {
	return &superadminHandler{svc: svc}
}

// helper: send OK
func okJSON(c *gin.Context, status int, data interface{}, err error) {
	if err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, status, data)
}

// Dashboard ------------------------------------------------------------------

func (h *superadminHandler) StatistikUmum(c *gin.Context) {
	out, err := h.svc.StatistikUmum(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) StatistikLayanan(c *gin.Context) {
	out, err := h.svc.StatistikLayananTop6(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) StatistikLiveOrders(c *gin.Context) {
	out, err := h.svc.StatistikLiveOrdersPerCabang(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) StatistikCabangTop(c *gin.Context) {
	out, err := h.svc.AmbilTopCabang(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) StatistikPembayaran(c *gin.Context) {
	out, err := h.svc.StatistikPembayaran(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

// Orders --------------------------------------------------------------------

func (h *superadminHandler) ListPesanan(c *gin.Context) {
	out, err := h.svc.ListPesanan(
		c.Request.Context(),
		intQuery(c, "page", 1), intQuery(c, "limit", 20),
		c.Query("status"), c.Query("search"),
	)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) OrdersStats(c *gin.Context) {
	out, err := h.svc.OrdersStats(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

// Services ------------------------------------------------------------------

func (h *superadminHandler) ListServices(c *gin.Context) {
	out, err := h.svc.ListServiceStats(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

// Vouchers ------------------------------------------------------------------

func (h *superadminHandler) ListVouchers(c *gin.Context) {
	out, err := h.svc.ListVouchers(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) VouchersStatistik(c *gin.Context) {
	out, err := h.svc.VouchersStatistik(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) CreateVoucher(c *gin.Context) {
	var req dtos.CreateVoucherRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.CreateVoucher(c.Request.Context(), req)
	okJSON(c, http.StatusCreated, out, err)
}

func (h *superadminHandler) GetVoucher(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	out, err := h.svc.GetVoucher(c.Request.Context(), id)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) UpdateVoucher(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	var req dtos.UpdateVoucherRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.UpdateVoucher(c.Request.Context(), id, req)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) DeleteVoucher(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	err := h.svc.DeleteVoucher(c.Request.Context(), id)
	okJSON(c, http.StatusOK, gin.H{"deleted": true}, err)
}

// Staffs --------------------------------------------------------------------

func (h *superadminHandler) ListPegawai(c *gin.Context) {
	out, err := h.svc.ListPegawai(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) CreatePegawai(c *gin.Context) {
	var req dtos.CreatePegawaiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.CreatePegawai(c.Request.Context(), req)
	okJSON(c, http.StatusCreated, out, err)
}

func (h *superadminHandler) UpdatePegawai(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	var req dtos.UpdatePegawaiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.UpdatePegawai(c.Request.Context(), id, req)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) DeletePegawai(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	err := h.svc.DeletePegawai(c.Request.Context(), id)
	okJSON(c, http.StatusOK, gin.H{"deleted": true}, err)
}

// Couriers ------------------------------------------------------------------

func (h *superadminHandler) ListKurir(c *gin.Context) {
	out, err := h.svc.ListKurir(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) CreateKurir(c *gin.Context) {
	var req dtos.CreateKurirRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.CreateKurir(c.Request.Context(), req)
	okJSON(c, http.StatusCreated, out, err)
}

func (h *superadminHandler) UpdateKurir(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	var req dtos.UpdateKurirRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.UpdateKurir(c.Request.Context(), id, req)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) DeleteKurir(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	err := h.svc.DeleteKurir(c.Request.Context(), id)
	okJSON(c, http.StatusOK, gin.H{"deleted": true}, err)
}

func (h *superadminHandler) ListTipeKendaraan(c *gin.Context) {
	out, err := h.svc.ListTipeKendaraan(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

// Branches ------------------------------------------------------------------

func (h *superadminHandler) ListCabang(c *gin.Context) {
	out, err := h.svc.ListCabang(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) GetCabang(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	out, err := h.svc.GetCabang(c.Request.Context(), id)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) DeleteCabang(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	err := h.svc.DeleteCabang(c.Request.Context(), id)
	okJSON(c, http.StatusOK, gin.H{"deleted": true}, err)
}

func (h *superadminHandler) BranchPerformance(c *gin.Context) {
	out, err := h.svc.BranchPerformance(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) BranchServices(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	out, err := h.svc.BranchServices(c.Request.Context(), id)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) BranchReviews(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	out, err := h.svc.BranchReviews(
		c.Request.Context(), id,
		intQuery(c, "page", 1), intQuery(c, "limit", 20),
	)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) CreateCabang(c *gin.Context) {
	var req dtos.CreateCabangRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.CreateCabang(c.Request.Context(), req)
	okJSON(c, http.StatusCreated, out, err)
}

func (h *superadminHandler) UpdateCabang(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	var req dtos.UpdateCabangRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	out, err := h.svc.UpdateCabang(c.Request.Context(), id, req)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) CreateTarif(c *gin.Context) {
	cabangID, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	var req dtos.CreateTarifRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.svc.CreateTarif(c.Request.Context(), cabangID, req); err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusCreated, gin.H{"created": true})
}

func (h *superadminHandler) UpdateTarif(c *gin.Context) {
	cabangID, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	var req dtos.UpdateTarifRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.svc.UpdateTarif(c.Request.Context(), cabangID, req); err != nil {
		handleServiceError(c, err)
		return
	}
	common.OK(c, http.StatusOK, gin.H{"updated": true})
}

// Payments ------------------------------------------------------------------

func (h *superadminHandler) ListPayments(c *gin.Context) {
	out, err := h.svc.ListPayments(
		c.Request.Context(),
		c.Query("method"), c.Query("search"),
		intQuery(c, "page", 1), intQuery(c, "limit", 20),
	)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) PaymentByCustomerForCabang(c *gin.Context) {
	cabangID, ok := parsePathInt(c, "cabangId")
	if !ok {
		return
	}
	out, err := h.svc.PaymentByCustomerForCabang(
		c.Request.Context(), cabangID,
		intQuery(c, "page", 1), intQuery(c, "limit", 20),
	)
	okJSON(c, http.StatusOK, out, err)
}

// Customers -----------------------------------------------------------------

func (h *superadminHandler) ListCustomers(c *gin.Context) {
	out, err := h.svc.ListCustomers(
		c.Request.Context(), c.Query("search"),
		intQuery(c, "page", 1), intQuery(c, "limit", 50),
	)
	okJSON(c, http.StatusOK, out, err)
}

func (h *superadminHandler) GetCustomer(c *gin.Context) {
	id, ok := parsePathInt(c, "id")
	if !ok {
		return
	}
	out, err := h.svc.GetCustomer(c.Request.Context(), id)
	okJSON(c, http.StatusOK, out, err)
}

// Catalog -------------------------------------------------------------------

func (h *superadminHandler) ListLayanan(c *gin.Context) {
	out, err := h.svc.ListLayanan(c.Request.Context())
	okJSON(c, http.StatusOK, out, err)
}

package handlers

import (
	"arthamna/NiLaundry/pkg/common"
	"arthamna/NiLaundry/pkg/middleware"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// parsePathInt reads a path parameter as int.
func parsePathInt(c *gin.Context, key string) (int, bool) {
	raw := c.Param(key)
	n, err := strconv.Atoi(raw)
	if err != nil || n <= 0 {
		common.Fail(c, http.StatusBadRequest, "invalid path parameter "+key)
		return 0, false
	}
	return n, true
}

// requireOwnership ensures the {id} in URL equals the JWT pelanggan_id.
func requireOwnership(c *gin.Context, pathPelangganID int) bool {
	jwtID := middleware.GetPelangganID(c)
	if jwtID == 0 || jwtID != pathPelangganID {
		common.Fail(c, http.StatusForbidden, "forbidden")
		return false
	}
	return true
}

// handleServiceError translates AppError/other errors into envelope responses.
func handleServiceError(c *gin.Context, err error) {
	if ae, ok := common.AsAppError(err); ok {
		common.Fail(c, ae.Status, ae.Message)
		return
	}
	common.Fail(c, http.StatusInternalServerError, err.Error())
}

package middleware

import (
	"arthamna/NiLaundry/constants"
	"arthamna/NiLaundry/internal/repositories"
	"arthamna/NiLaundry/pkg/common"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// RequireBranchAccess gates /branch/:cabangId/... routes:
//   - superadmin: pass through, can access any cabang
//   - admin: must satisfy pengguna.cabang_laundry_id_cabang == path[:cabangId]
//   - everyone else: 403
//
// JWT is intentionally NOT extended with cabangId — we look it up from the
// `pengguna` table on each request via `penggunaRepo`. Cheap enough for this
// project and avoids invalidating tokens issued before the schema change.
func RequireBranchAccess(penggunaRepo repositories.PenggunaRepository, paramName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role := GetRole(c)
		if role == constants.RoleSuperAdmin {
			c.Next()
			return
		}
		if role != constants.RoleAdmin {
			common.Fail(c, http.StatusForbidden, "forbidden")
			c.Abort()
			return
		}

		raw := c.Param(paramName)
		pathCabang, err := strconv.Atoi(raw)
		if err != nil || pathCabang <= 0 {
			common.Fail(c, http.StatusBadRequest, "invalid path parameter "+paramName)
			c.Abort()
			return
		}

		penggunaID := GetPenggunaID(c)
		if penggunaID == 0 {
			common.Fail(c, http.StatusForbidden, "forbidden")
			c.Abort()
			return
		}

		p, err := penggunaRepo.FindByIDWithRole(c.Request.Context(), penggunaID)
		if err != nil {
			common.Fail(c, http.StatusInternalServerError, err.Error())
			c.Abort()
			return
		}
		if p == nil || p.CabangLaundryIDCabang == nil || *p.CabangLaundryIDCabang != pathCabang {
			common.Fail(c, http.StatusForbidden, "branch access denied")
			c.Abort()
			return
		}
		c.Next()
	}
}

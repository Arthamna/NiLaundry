package middleware

import (
	"arthamna/NiLaundry/constants"
	"arthamna/NiLaundry/pkg/auth"
	"arthamna/NiLaundry/pkg/common"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Context keys populated by Authenticate.
const (
	ContextKeySubjectID   = "subjectId"
	ContextKeySubjectType = "subjectType"
	ContextKeyRole        = "role"
)

// Authenticate verifies the bearer token and populates the request context
// with the subject's identity + role. Attach this to any protected group:
//
//	protected := r.Group("/")
//	protected.Use(middleware.Authenticate(jwt))
//
// On its own it lets any authenticated subject through. Compose it with
// RequireRole / RequireAnyRole / RequirePelanggan to gate by role.
func Authenticate(jwtService auth.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			common.Fail(c, http.StatusUnauthorized, "authorization header required")
			c.Abort()
			return
		}
		tokenString := strings.TrimSpace(strings.TrimPrefix(header, "Bearer "))
		if tokenString == "" {
			common.Fail(c, http.StatusUnauthorized, "missing bearer token")
			c.Abort()
			return
		}
		claims, err := jwtService.ValidateToken(tokenString)
		if err != nil {
			common.Fail(c, http.StatusUnauthorized, "invalid token")
			c.Abort()
			return
		}
		c.Set(ContextKeySubjectID, claims.SubjectID)
		c.Set(ContextKeySubjectType, claims.SubjectType)
		c.Set(ContextKeyRole, claims.Role)
		c.Next()
	}
}

// RequireAnyRole gates a route to subjects whose role matches any of `roles`.
// Use after Authenticate, e.g.:
//
//	admin := r.Group("/admin")
//	admin.Use(middleware.Authenticate(jwt), middleware.RequireAnyRole(constants.RoleAdmin, constants.RoleSuperAdmin))
func RequireAnyRole(roles ...string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(roles))
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(c *gin.Context) {
		role, _ := c.Get(ContextKeyRole)
		roleStr, _ := role.(string)
		if _, ok := allowed[roleStr]; !ok {
			common.Fail(c, http.StatusForbidden, "forbidden")
			c.Abort()
			return
		}
		c.Next()
	}
}

// RequireRole is a single-role convenience wrapper around RequireAnyRole.
func RequireRole(role string) gin.HandlerFunc { return RequireAnyRole(role) }

// RequirePelanggan gates a route to authenticated customers only.
func RequirePelanggan() gin.HandlerFunc { return RequireAnyRole(constants.RoleCustomer) }

// RequireAdmin gates a route to admin or superadmin.
func RequireAdmin() gin.HandlerFunc {
	return RequireAnyRole(constants.RoleAdmin, constants.RoleSuperAdmin)
}

// RequireSuperAdmin gates a route to superadmin only.
func RequireSuperAdmin() gin.HandlerFunc { return RequireAnyRole(constants.RoleSuperAdmin) }

// --- accessors -------------------------------------------------------------

// GetSubjectID returns the JWT subject_id (pelanggan or pengguna id).
func GetSubjectID(c *gin.Context) int {
	v, _ := c.Get(ContextKeySubjectID)
	id, _ := v.(int)
	return id
}

func GetSubjectType(c *gin.Context) string {
	v, _ := c.Get(ContextKeySubjectType)
	s, _ := v.(string)
	return s
}

func GetRole(c *gin.Context) string {
	v, _ := c.Get(ContextKeyRole)
	s, _ := v.(string)
	return s
}

// GetPelangganID returns the customer id only when the JWT subject is a
// pelanggan; otherwise 0. Use this for customer-scoped routes.
func GetPelangganID(c *gin.Context) int {
	if GetSubjectType(c) != constants.SubjectTypePelanggan {
		return 0
	}
	return GetSubjectID(c)
}

// GetPenggunaID returns the backoffice user id only when the JWT subject is
// a pengguna; otherwise 0.
func GetPenggunaID(c *gin.Context) int {
	if GetSubjectType(c) != constants.SubjectTypePengguna {
		return 0
	}
	return GetSubjectID(c)
}

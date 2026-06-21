package common

import "github.com/gin-gonic/gin"

type Envelope struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Error   *string     `json:"error"`
}

func OK(c *gin.Context, status int, data interface{}) {
	c.JSON(status, Envelope{Success: true, Data: data, Error: nil})
}

func Fail(c *gin.Context, status int, message string) {
	msg := message
	c.JSON(status, Envelope{Success: false, Data: nil, Error: &msg})
}

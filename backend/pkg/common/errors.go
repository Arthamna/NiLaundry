package common

import "errors"

// AppError carries an HTTP status hint alongside the message.
type AppError struct {
	Status  int
	Message string
}

func (e *AppError) Error() string { return e.Message }

func NewAppError(status int, message string) *AppError {
	return &AppError{Status: status, Message: message}
}

// AsAppError unwraps an AppError if present.
func AsAppError(err error) (*AppError, bool) {
	var ae *AppError
	if errors.As(err, &ae) {
		return ae, true
	}
	return nil, false
}

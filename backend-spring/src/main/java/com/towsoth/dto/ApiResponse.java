package com.towsoth.dto;

public class ApiResponse<T> {
    private Boolean success;
    private T data;
    private String error;
    private String message;
    private Integer statusCode;

    public ApiResponse() {
    }

    public ApiResponse(Boolean success, T data, String error, String message, Integer statusCode) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.message = message;
        this.statusCode = statusCode;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(Integer statusCode) {
        this.statusCode = statusCode;
    }
}


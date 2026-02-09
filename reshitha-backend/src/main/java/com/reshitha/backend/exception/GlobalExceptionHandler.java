package com.reshitha.backend.exception;

import com.reshitha.backend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(false, ex.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace(); // Log the error to console
        return new ResponseEntity<>(
                new ApiResponse<>(false, ex.getMessage(), null),

                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Object>> handleMaxSizeException(
            org.springframework.web.multipart.MaxUploadSizeExceededException exc) {
        return new ResponseEntity<>(
                new ApiResponse<>(false, "File too large! Please upload a file smaller than 10MB.", null),
                HttpStatus.EXPECTATION_FAILED);
    }
}

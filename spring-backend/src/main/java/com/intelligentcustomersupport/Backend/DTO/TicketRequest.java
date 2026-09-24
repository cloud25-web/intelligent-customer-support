package com.intelligentcustomersupport.Backend.DTO;

import jakarta.validation.constraints.NotBlank;

public class TicketRequest {

    @NotBlank
    private String customerId;

    @NotBlank
    private String message;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
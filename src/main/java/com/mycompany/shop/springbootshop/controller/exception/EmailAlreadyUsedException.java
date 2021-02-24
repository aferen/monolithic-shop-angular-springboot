package com.mycompany.shop.springbootshop.controller.exception;


public class EmailAlreadyUsedException extends BadRequestException {

    private static final long serialVersionUID = 1L;

    public EmailAlreadyUsedException() {
        super(null, "Email is already in use!", "userManagement", "emailexists");
    }
}


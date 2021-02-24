package com.mycompany.shop.springbootshop.controller.vm;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LoginVM {
	@NotNull
	@Size(min = 1, max = 100)
	private String email;

	@NotNull
	@Size(min = 4, max = 100)
	private String password;

	private Boolean rememberMe;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Boolean isRememberMe() {
		return rememberMe;
	}

	public void setRememberMe(Boolean rememberMe) {
		this.rememberMe = rememberMe;
	}

	@Override
	public String toString() {
		return "LoginVM{" + "email='" + email + '\'' + ", rememberMe=" + rememberMe + '}';
	}
}

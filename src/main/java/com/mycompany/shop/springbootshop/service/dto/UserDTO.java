package com.mycompany.shop.springbootshop.service.dto;

import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import com.mycompany.shop.springbootshop.domain.Authority;
import com.mycompany.shop.springbootshop.domain.User;

public class UserDTO {
	@Id
	private String id;

    @Size(max = 50)
	private String firstName;

    @Size(max = 50)
	private String lastName;

	@Email
    @Size(max = 50)
	private String email;

    @Size(max = 50)
	private String phone;

    @Size(max = 50)
	private String city;

    @Size(max = 50)
	private String country;
    
	private Set<String> authorities;

    public UserDTO() {
        // Empty constructor needed for Jackson.
    }
    
	public UserDTO(User user) {
		super();
		this.id = user.getId();
		this.firstName = user.getFirstName();
		this.lastName = user.getLastName();
		this.email = user.getEmail();
		this.phone = user.getPhone();
		this.city = user.getCity();
		this.country = user.getCountry();
		this.authorities = user.getAuthorities().stream()
            .map(Authority::getName)
            .collect(Collectors.toSet());
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

    public Set<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

}

package com.mycompany.shop.springbootshop.controller;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import javax.validation.Valid;
import com.mycompany.shop.springbootshop.controller.exception.EmailAlreadyUsedException;
import com.mycompany.shop.springbootshop.controller.exception.InvalidPasswordException;
import com.mycompany.shop.springbootshop.controller.vm.ManagedUserVM;
import com.mycompany.shop.springbootshop.domain.User;
import com.mycompany.shop.springbootshop.repository.UserRepository;
import com.mycompany.shop.springbootshop.security.SecurityUtils;
import com.mycompany.shop.springbootshop.service.UserService;
import com.mycompany.shop.springbootshop.service.dto.PasswordChangeDTO;
import com.mycompany.shop.springbootshop.service.dto.UserDTO;

@RestController
@RequestMapping("/api")
public class AccountController {

	private static class AccountResourceException extends RuntimeException {
		private AccountResourceException(String message) {
			super(message);
		}
	}

	private final Logger log = LoggerFactory.getLogger(AccountController.class);

	private final UserRepository userRepository;

	private final UserService userService;

	// private final MailService mailService;

	public AccountController(UserRepository userRepository, UserService userService) {

		this.userRepository = userRepository;
		this.userService = userService;
		// this.mailService = mailService;
	}

	@PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        if (!checkPasswordLength(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
        //mailService.sendActivationEmail(user);
    }

	@GetMapping("/account")
	public UserDTO getAccount() {
		return userService.getUserWithAuthorities().map(UserDTO::new)
				.orElseThrow(() -> new AccountResourceException("User could not be found"));
	}


	@PostMapping("/account")
    public void updateAccount(@Valid @RequestBody UserDTO userDTO) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new AccountResourceException("Current user login not found"));
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getEmail().equalsIgnoreCase(userLogin))) {
            throw new EmailAlreadyUsedException();
        }
        Optional<User> user = userRepository.findOneByEmailIgnoreCase(userLogin);
        if (!user.isPresent()) {
            throw new AccountResourceException("User could not be found");
        }
        userService.updateUser(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail());
    }

    @PostMapping(path = "/account/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDto) {
		if (!checkPasswordLength(passwordChangeDto.getNewPassword())) {
			throw new InvalidPasswordException();
        }
        userService.changePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword());
    }

	private static boolean checkPasswordLength(String password) {
        return !StringUtils.isEmpty(password) &&
            password.length() >= ManagedUserVM.PASSWORD_MIN_LENGTH &&
            password.length() <= ManagedUserVM.PASSWORD_MAX_LENGTH;
    }

}

package com.mycompany.shop.springbootshop.service;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.mycompany.shop.springbootshop.controller.exception.EmailAlreadyUsedException;
import com.mycompany.shop.springbootshop.controller.exception.InvalidPasswordException;
import com.mycompany.shop.springbootshop.domain.Authority;
import com.mycompany.shop.springbootshop.domain.User;
import com.mycompany.shop.springbootshop.repository.AuthorityRepository;
import com.mycompany.shop.springbootshop.repository.UserRepository;
import com.mycompany.shop.springbootshop.security.AuthoritiesConstants;
import com.mycompany.shop.springbootshop.security.SecurityUtils;
import com.mycompany.shop.springbootshop.service.dto.UserDTO;

@Service
public class UserService {
	private final Logger log = LoggerFactory.getLogger(UserService.class);

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final AuthorityRepository authorityRepository;


	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository) {
		this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
		this.authorityRepository = authorityRepository;
	}

	public Optional<User> getUserWithAuthorities() {
		return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneByEmailIgnoreCase);
	}

	public User registerUser(UserDTO userDTO, String password) {
        userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            if (existingUser != null) {
                throw new EmailAlreadyUsedException();
            }
        });
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setPassword(encryptedPassword);
        newUser.setEmail(userDTO.getEmail().toLowerCase());
        newUser.setVerified(false);
        newUser.setVerification(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        //this.clearUserCaches(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    public void updateUser(String firstName, String lastName, String email) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByEmailIgnoreCase)
            .ifPresent(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                userRepository.save(user);
                //this.clearUserCaches(user);
                log.debug("Changed Information for User: {}", user);
            });
    }


    public void changePassword(String currentClearTextPassword, String newPassword) { 
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByEmailIgnoreCase)
            .ifPresent(user -> {
                log.error(user.getPassword());

                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                userRepository.save(user);
                //this.clearUserCaches(user);
                log.debug("Changed password for User: {}", user);
            });
    }

}

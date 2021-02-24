package com.mycompany.shop.springbootshop.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.mycompany.shop.springbootshop.domain.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
	String USERS_BY_EMAIL_CACHE = "usersByEmail";

	//@Cacheable(cacheNames = USERS_BY_EMAIL_CACHE)
	Optional<User> findOneByEmailIgnoreCase(String email);

	//@Cacheable(cacheNames = USERS_BY_EMAIL_CACHE)
	Optional<User> findOneByEmail(String email);

}

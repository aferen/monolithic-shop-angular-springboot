package com.mycompany.shop.springbootshop.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.shop.springbootshop.domain.Promo;
import com.mycompany.shop.springbootshop.repository.PromoRepository;

@RestController
@RequestMapping("/api")
public class PromoController {
	private final Logger log = LoggerFactory.getLogger(PromoController.class);
	private final PromoRepository promoRepository;

	public PromoController(PromoRepository promoRepository) {
		this.promoRepository = promoRepository;
	}

	@GetMapping("/promos")
	public List<Promo> getAllProducts() {
		log.debug("REST request to get all Promos");
		return promoRepository.findAll();
	}

}

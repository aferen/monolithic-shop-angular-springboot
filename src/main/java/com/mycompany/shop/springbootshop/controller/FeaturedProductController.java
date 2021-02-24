package com.mycompany.shop.springbootshop.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.shop.springbootshop.domain.FeaturedProduct;
import com.mycompany.shop.springbootshop.repository.FeaturedProductRepository;

@RestController
@RequestMapping("/api")
public class FeaturedProductController {
	private final Logger log = LoggerFactory.getLogger(ProductController.class);

	private final FeaturedProductRepository featuredProductRepository;
	
	public FeaturedProductController(FeaturedProductRepository featuredProductRepository) {
		this.featuredProductRepository = featuredProductRepository;
	}
	
	@GetMapping("/featuredproducts")
	public List<FeaturedProduct> getFeaturedProducts(){
		log.debug("REST request to get all Featured Products");
		return featuredProductRepository.findAll();
	}
}

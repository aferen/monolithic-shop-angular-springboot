package com.mycompany.shop.springbootshop.controller;

import com.mycompany.shop.springbootshop.controller.exception.BadRequestException;
import com.mycompany.shop.springbootshop.controller.exception.NotFoundException;
import com.mycompany.shop.springbootshop.repository.ProductRepository;
import com.mycompany.shop.springbootshop.repository.search.ProductSearchRepository;
import com.mycompany.shop.springbootshop.domain.Product;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProductController {
	private final Logger log = LoggerFactory.getLogger(ProductController.class);

	private final ProductRepository productRepository;

	private final ProductSearchRepository productSearchRepository;

	public ProductController(ProductRepository productRepository, ProductSearchRepository productSearchRepository) {
		this.productRepository = productRepository;
		this.productSearchRepository = productSearchRepository;
	}

	@GetMapping("/products")
	public List<Product> getAllProducts() {
		log.debug("REST request to get all Products");
		return productRepository.findAll();
	}

	@GetMapping("/products/{id}")
	public Product getProductById(@PathVariable String id) {
		log.debug("REST request to get Product : {}", id);
		return productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product id " + id + " not found"));
	}
	
	@GetMapping("/products/date/{limit}")
	public List<Product> getProductByDate(@PathVariable int limit){
		log.debug("REST request to get Products By Date");
		return productRepository.findByDate(limit);
	}
	
	@GetMapping("/products/query/{columnName}/{value}/{limit}")
	public List<Product> getProductByQuery(@PathVariable String columnName, @PathVariable boolean value,@PathVariable int limit){
		log.debug("REST request to get Products By Query");
		return productRepository.findByQuery(columnName, value, limit);
	}
	
	@GetMapping("/products/rating/{limit}")
	public List<Product> getProductByRating(@PathVariable int limit){
		log.debug("REST request to get Products By Rating");
		return productRepository.findByRating(limit);
	}
	
	@GetMapping("/products/search/{parameter}")
	public List<Product> getProductBySearchParameter(@PathVariable String parameter){
		log.debug("REST request to get Products By Search Parameter");
		return productSearchRepository.findBySearchParameter(parameter);

		//return productRepository.findBySearchParameter(parameter);
	}

	@PostMapping("/products")
	@PreAuthorize("hasAnyAuthority('admin')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) throws URISyntaxException {
        log.debug("REST request to save Product : {}", product);
        if (StringUtils.isNotBlank(product.getId())) {
            throw new BadRequestException("A new product cannot already have an id","product", "idexists");
        }
        Product result = productRepository.save(product);
        return ResponseEntity.created(new URI("/api/products/" + result.getId())).body(result);
    }

	@PutMapping(value = "/products")
	@PreAuthorize("hasAnyAuthority('admin')")
    public ResponseEntity<Product> updateProduct(@Valid @RequestBody Product product) {
		log.debug("REST request to update Product : {}", product);
		if (StringUtils.isBlank(product.getId())) {
            throw new BadRequestException("Invalid id", "product", "idnull");
		}
		Product result = productRepository.save(product);
		return ResponseEntity.ok().body(result);		
    }

	@DeleteMapping("/products/{id}")
	@PreAuthorize("hasAnyAuthority('admin')")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        log.debug("REST request to delete Product : {}", id);
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

	@PutMapping(value = "/products/rating")
	@PreAuthorize("isAuthenticated()")
    public ResponseEntity<Product> updateProductRating(@Valid @RequestBody Product product) {
		log.debug("REST request to update Product Rating: {}", product);
		if (StringUtils.isBlank(product.getId())) {
            throw new BadRequestException("Invalid id", "product", "idnull");
		}
		Product result = productRepository.save(product);
		return ResponseEntity.ok().body(result);		
    }

}

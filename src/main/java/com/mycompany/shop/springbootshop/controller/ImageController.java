package com.mycompany.shop.springbootshop.controller;

import java.io.IOException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import com.mycompany.shop.springbootshop.service.FileService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.core.io.Resource;

@RestController
@RequestMapping("/api")
public class ImageController {
	private final Logger log = LoggerFactory.getLogger(ProductController.class);


	private final FileService fileService;

	public ImageController(FileService fileService) {
		this.fileService = fileService;
	}
	

	@GetMapping(value = "/images/products/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<Resource> getProductImage(@PathVariable String imageName) throws IOException {
		log.debug("REST request to get Product Image : {}", imageName);
		Resource resource = fileService.getFile(imageName, "products");
		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
	}
	
	@GetMapping(value = "/images/featuredproducts/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<Resource> getFeaturedImage(@PathVariable String imageName) throws IOException {
		log.debug("REST request to get Featured Image : {}", imageName);
		Resource resource = fileService.getFile(imageName, "featured");
		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
	}
	
	@GetMapping(value = "/images/promos/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<Resource> getPromoImage(@PathVariable String imageName) throws IOException {
		log.debug("REST request to get Featured Image : {}", imageName);
		Resource resource = fileService.getFile(imageName, "promo");
		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
	}

	@PostMapping(value = "/images/product")
	@PreAuthorize("hasAnyAuthority('admin')")
	public List<String> addProductImage(@RequestParam("file") MultipartFile[] files, RedirectAttributes redirectAttributes) throws IOException {
		log.debug("REST request to save Product Images");
		return Arrays.asList(files)
                .stream()
                .map(file -> fileService.uploadFile(file, "products"))
                .collect(Collectors.toList());
	}

	@DeleteMapping(value = "/images/product/{fileName}")
	@PreAuthorize("hasAnyAuthority('admin')")
	public ResponseEntity<Void> deleteProductImage(@PathVariable String fileName, RedirectAttributes redirectAttributes) throws IOException {
		log.debug("REST request to delete Product Images"+fileName);
	    fileService.deleteFile(fileName, "products");
        return ResponseEntity.noContent().build();
	}
		
}

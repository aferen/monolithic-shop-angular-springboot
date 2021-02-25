package com.mycompany.shop.springbootshop.controller;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mycompany.shop.springbootshop.repository.OrderRepository;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import javax.validation.Valid;
import com.mycompany.shop.springbootshop.controller.exception.BadRequestException;
import com.mycompany.shop.springbootshop.domain.Order;

@RestController
@RequestMapping("/api")
public class OrderController {
    private final Logger log = LoggerFactory.getLogger(ProductController.class);

	private final OrderRepository orderRepository;

	public OrderController(OrderRepository orderRepository) {
		this.orderRepository = orderRepository;
	}

	@GetMapping("/orders/{userId}")
	public List<Order> getOrdersByUserId(@PathVariable String userId) {
		log.debug("REST request to get Orders of User: {}", userId);
		return orderRepository.findAllByUserId(userId);
	}

	@PostMapping("/orders/{userId}")
	public ResponseEntity<Order> addOrdersByUserId(@PathVariable String userId, @Valid @RequestBody Order order) throws URISyntaxException {
		log.debug("REST request to save Order of User : {}", userId);
        if (StringUtils.isNotBlank(order.getId())) {
            throw new BadRequestException("A new order cannot already have an id","order", "idexists");
        }
        Order result = orderRepository.save(order);
        return ResponseEntity.created(new URI("/api/orders/" + result.getId())).body(result);
 
	}
}

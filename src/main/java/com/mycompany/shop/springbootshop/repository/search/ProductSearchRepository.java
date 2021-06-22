package com.mycompany.shop.springbootshop.repository.search;

import java.util.List;

import com.mycompany.shop.springbootshop.domain.Product;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ProductSearchRepository extends ElasticsearchRepository<Product, String> {

    @Query("{\"bool\": {\"must\": [{\"match\": {\"products.name\": \"?0\"}}]}}")
    List<Product> findBySearchParameter(String name);

}

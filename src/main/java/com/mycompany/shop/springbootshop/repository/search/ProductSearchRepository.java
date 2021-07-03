package com.mycompany.shop.springbootshop.repository.search;

import java.util.List;
import com.mycompany.shop.springbootshop.domain.Product;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ProductSearchRepository extends ElasticsearchRepository<Product, String> {

    List<Product> findAllByNameStartsWith(String name);
    
}

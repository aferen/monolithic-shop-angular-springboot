package com.mycompany.shop.springbootshop.config;

import springfox.documentation.service.ApiInfo;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.builders.RequestHandlerSelectors;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import java.util.ArrayList;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;

@Configuration
public class SwaggerConfiguration {
    
    @Bean
    public Docket api() {
        //JHipsterProperties.Swagger properties = jHipsterProperties.getSwagger();
        
        Contact contact = new Contact(
            "ContactName",
            "ContactUrl",
            "ContactEmail"
        );

        ApiInfo apiInfo = new ApiInfo(
            "API First " + "Title",
            "Description",
            "Version",
            "TermsOfServiceUrl",
            contact,
            "License",
            "LicenseUrl",
            new ArrayList<>()
        );

        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors
                        .basePackage("com.mycompany.shop.springbootshop.controller"))
                .paths(PathSelectors.regex("/.*"))
                .build()
                .apiInfo(apiInfo);
    }

}

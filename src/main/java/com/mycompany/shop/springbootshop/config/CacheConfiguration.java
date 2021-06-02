package com.mycompany.shop.springbootshop.config;

import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;
import java.net.URI;
import org.redisson.Redisson;
import org.redisson.config.Config;
import org.redisson.config.ClusterServersConfig;
import org.redisson.config.SingleServerConfig;
import org.redisson.jcache.configuration.RedissonConfiguration;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.hibernate.cache.jcache.ConfigSettings;

import java.util.concurrent.TimeUnit;

import javax.cache.configuration.MutableConfiguration;
import javax.cache.expiry.CreatedExpiryPolicy;
import javax.cache.expiry.Duration;
import org.springframework.core.env.Environment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@EnableCaching
public class CacheConfiguration {
    private final Logger log = LoggerFactory.getLogger(CacheConfiguration.class);

    private GitProperties gitProperties;
    private BuildProperties buildProperties;

    @Bean
    public javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration(Environment env) {
        MutableConfiguration<Object, Object> jcacheConfig = new MutableConfiguration<>();

        URI redisUri = URI.create(env.getProperty("app.cache.redis.server"));
           
        Config config = new Config();
        
       
        if (Boolean.valueOf(env.getProperty("app.cache.redis.cluster"))) {
            ClusterServersConfig clusterServersConfig = config
                .useClusterServers()
                .setMasterConnectionPoolSize(Integer.parseInt(env.getProperty("app.cache.redis.connectionPoolSize")))
                .setMasterConnectionMinimumIdleSize(Integer.parseInt(env.getProperty("app.cache.redis.connectionMinimumIdleSize")))
                .setSubscriptionConnectionPoolSize(Integer.parseInt(env.getProperty("app.cache.redis.subscriptionConnectionPoolSize")))
                .addNodeAddress(redisUri.toString()); //TODO:it should be an array which include cluster redis url

            if (redisUri.getUserInfo() != null) {
                clusterServersConfig.setPassword(redisUri.getUserInfo().substring(redisUri.getUserInfo().indexOf(':') + 1));
            }
        } else {
            SingleServerConfig singleServerConfig = config
                .useSingleServer()
                .setConnectionPoolSize(Integer.parseInt(env.getProperty("app.cache.redis.connectionPoolSize")))
                .setConnectionMinimumIdleSize(Integer.parseInt(env.getProperty("app.cache.redis.connectionMinimumIdleSize")))
                .setSubscriptionConnectionPoolSize(Integer.parseInt(env.getProperty("app.cache.redis.subscriptionConnectionPoolSize")))
                .setAddress(redisUri.toString());

            if (redisUri.getUserInfo() != null) {
                singleServerConfig.setPassword(redisUri.getUserInfo().substring(redisUri.getUserInfo().indexOf(':') + 1));
            }
        }
        jcacheConfig.setStatisticsEnabled(true);
        jcacheConfig.setExpiryPolicyFactory(CreatedExpiryPolicy.factoryOf(new Duration(TimeUnit.SECONDS, Integer.parseInt(env.getProperty("app.cache.redis.expiration")))));
        return RedissonConfiguration.fromInstance(Redisson.create(config), jcacheConfig);
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cm) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cm);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer(javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration) {
        return cm -> {
            createCache(cm, com.mycompany.shop.springbootshop.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            createCache(cm, com.mycompany.shop.springbootshop.domain.User.class.getName(), jcacheConfiguration);
            createCache(cm, com.mycompany.shop.springbootshop.domain.Authority.class.getName(), jcacheConfiguration);
            createCache(cm, com.mycompany.shop.springbootshop.domain.User.class.getName() + ".authorities", jcacheConfiguration);
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName, javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache == null) {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }
}


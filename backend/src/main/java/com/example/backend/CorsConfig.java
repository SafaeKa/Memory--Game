package com.example.backend;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Allow all origins
                .allowedOrigins("http://localhost:63342")  // Add allowed origins here
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Add allowed methods
                .allowedHeaders("*");  // Add allowed headers
    }
}


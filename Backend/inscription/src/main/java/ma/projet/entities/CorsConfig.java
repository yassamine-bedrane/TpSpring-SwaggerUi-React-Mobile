package ma.projet.entities;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Define the allowed origins (e.g., your React frontend's URL)
        config.addAllowedOrigin("http://localhost:3000");

        // Define the allowed HTTP methods (e.g., POST, GET, PUT, DELETE)
        config.addAllowedMethod("*");

        // Define the allowed headers (e.g., Content-Type, Authorization)
        config.addAllowedHeader("*");

        // Allow credentials such as cookies
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

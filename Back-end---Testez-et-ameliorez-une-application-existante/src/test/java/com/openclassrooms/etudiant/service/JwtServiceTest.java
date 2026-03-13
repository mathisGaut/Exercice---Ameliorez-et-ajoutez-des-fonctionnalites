package com.openclassrooms.etudiant.service;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;

public class JwtServiceTest {

    private final JwtService jwtService = new JwtService();

    // Test generateToken
    @Test
    public void generateToken_returnsNonEmptyToken() {
        UserDetails userDetails = User.builder()
                .username("testuser")
                .password("encoded")
                .authorities("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3); // JWT format: header.payload.signature
    }

    // Test extractUsername et isTokenValid
    @Test
    public void extractUsername_and_isTokenValid_validToken_returnsTrue() {
        UserDetails userDetails = User.builder()
                .username("johndoe")
                .password("encoded")
                .authorities("USER")
                .build();

        String token = jwtService.generateToken(userDetails);
        String username = jwtService.extractUsername(token);
        boolean valid = jwtService.isTokenValid(token, userDetails);

        assertThat(username).isEqualTo("johndoe");
        assertThat(valid).isTrue();
    }
}

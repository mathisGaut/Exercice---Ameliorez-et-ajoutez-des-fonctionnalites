package com.openclassrooms.etudiant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDTO {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String login;
    @NotBlank
    @Size(min = 4, message = "Le mot de passe doit contenir au moins 4 caractères")
    private String password;

}

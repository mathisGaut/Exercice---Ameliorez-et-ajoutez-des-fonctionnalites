package com.openclassrooms.etudiant.mapper;

import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.entities.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserDtoMapper {

    public User toEntity(RegisterDTO registerDTO) {
        User user = new User();

        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setLogin(registerDTO.getLogin());
        user.setPassword(registerDTO.getPassword());

        // Champs ignorés avant → on les gère ici
        user.setCreated_at(LocalDateTime.now());
        user.setUpdated_at(LocalDateTime.now());

        return user;
    }
}

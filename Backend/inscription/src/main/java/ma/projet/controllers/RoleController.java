package ma.projet.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.projet.entities.Role;
import ma.projet.entities.User;
import ma.projet.repository.RoleRepository;
import ma.projet.services.RoleService;
import ma.projet.services.UserService;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin
public class RoleController {
    
    @Autowired
    private RoleService roleService;
    
    @Autowired
    private UserService userService;

    @GetMapping
    public List<Role> findAllRoles() {
        return roleService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Role role = roleService.findById(id);
        if (role == null) {
            return new ResponseEntity<Object>("Role with ID " + id + " not found", HttpStatus.NOT_FOUND);
        } else {
            return ResponseEntity.ok(role);
        }
    }

    @PostMapping
    public Role createRole(@RequestBody Role role) {
        role.setId(0L);
        return roleService.create(role);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateRole(@PathVariable Long id, @RequestBody Role role) {
        Role existingRole = roleService.findById(id);
        if (existingRole == null) {
            return new ResponseEntity<Object>("Role with ID " + id + " not found", HttpStatus.NOT_FOUND);
        } else {
            role.setId(id);
            return ResponseEntity.ok(roleService.update(role));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteRole(@PathVariable Long id) {
        Role role = roleService.findById(id);
        if (role == null) {
            return new ResponseEntity<Object>("Role with ID " + id + " not found", HttpStatus.NOT_FOUND);
        } else {
            roleService.delete(role);
            return ResponseEntity.ok("Role has been deleted");
        }
    }
    
    @PostMapping("/assign-roles")
    public ResponseEntity<User> assignRolesToUser(@RequestBody Map<String, Object> request) {
        Integer userIdInteger = (Integer) request.get("userId");
        Long userId = userIdInteger.longValue(); // Convert Integer to Long

        List<Integer> roleIdsInteger = (List<Integer>) request.get("roleIds");
        List<Long> roleIds = new ArrayList<>();
        for (Integer roleId : roleIdsInteger) {
            roleIds.add(roleId.longValue()); // Convert Integer to Long
        }

        User user = userService.assignRolesToUser(userId, roleIds);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }



}

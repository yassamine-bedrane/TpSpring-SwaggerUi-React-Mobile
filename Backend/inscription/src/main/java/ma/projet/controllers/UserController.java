package ma.projet.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.projet.entities.User;
import ma.projet.services.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
	@Autowired
	private UserService userService;
	

	@GetMapping
	public List<User> findAllFiliere(){
		return userService.findAll();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Object> findById(@PathVariable Long id) {
		User user = userService.findById(id);
		if(user == null) {
			return new ResponseEntity<Object>("Filiere with ID " + id + " not found", HttpStatus.BAD_REQUEST);
		}
		else {
			return ResponseEntity.ok(user);
		}
	}

}

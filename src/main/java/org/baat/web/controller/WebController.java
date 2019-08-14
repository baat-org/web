package org.baat.web.controller;

import static org.baat.core.constants.Constants.X_AUTH_TOKEN;

import java.net.URI;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

@Controller
public class WebController {

	@Value("${user_api_uri}")
	private String userApiURI;

	@Value("${chat_api_uri}")
	private String chatApiURI;

	@Value("${websockets_api_uri}")
	private String websocketsApiURI;

	@Value("${user_service_uri}")
	private String userServiceURI;

	@RequestMapping(value = { "/", "home" })
	public String home( @CookieValue(value = X_AUTH_TOKEN, required = false) final String userToken,
			final Model model ) {
		addURIsToModel( model );

		if ( validUserToken( userToken ) ) {
			return "home/home.html";
		} else {
			return "login/login.html";
		}
	}

	@RequestMapping(value = "/signup")
	public String signup( final Model model ) {
		addURIsToModel( model );
		return "signup/signup.html";
	}

	@RequestMapping(value = "/login")
	public String login( final Model model ) {
		addURIsToModel( model );
		return "login/login.html";
	}

	@RequestMapping(value = "/logout")
	public String logout( final Model model ) {
		addURIsToModel( model );
		return "login/logout.html";
	}

	private void addURIsToModel( final Model model ) {
		model.addAttribute( "userApiURI", userApiURI );
		model.addAttribute( "chatApiURI", chatApiURI );
		model.addAttribute( "websocketsApiURI", websocketsApiURI );
	}

	private boolean validUserToken( final String userToken ) {
		if ( StringUtils.isEmpty( userToken ) ) {
			return false;
		}

		try {
			return BooleanUtils.isTrue( new RestTemplate().getForObject(
					URI.create( userServiceURI + "/validateUserToken/" + userToken ),
					Boolean.class ) );
		} catch ( Exception exception ) {
			//TODO error logging
			return false;
		}
	}
}
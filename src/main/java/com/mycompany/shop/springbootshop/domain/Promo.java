package com.mycompany.shop.springbootshop.domain;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "promos")
public class Promo implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	
	private String preHeading;
	
	private String heading;

	private String afterHeading;

	private String imageName;

	private String buttonText;

	private String link;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPreHeading() {
		return preHeading;
	}

	public void setPreHeading(String preHeading) {
		this.preHeading = preHeading;
	}

	public String getHeading() {
		return heading;
	}

	public void setHeading(String heading) {
		this.heading = heading;
	}

	public String getAfterHeading() {
		return afterHeading;
	}

	public void setAfterHeading(String afterHeading) {
		this.afterHeading = afterHeading;
	}

	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	public String getButtonText() {
		return buttonText;
	}

	public void setButtonText(String buttonText) {
		this.buttonText = buttonText;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Promo other = (Promo) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Promo [id=" + id + ", preHeading=" + preHeading + ", heading=" + heading
				+ ", afterHeading=" + afterHeading + ", imageName=" + imageName + ", buttonText=" + buttonText
				+ ", link=" + link + "]";
	}

}

<?php
namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;

class StaticUser implements Authenticatable
{
	use AuthenticatableTrait;

	public $email;
	public $password;
	public $name;
	private $attributes;

	public function __construct($attributes)
	{
		foreach ($attributes as $key => $value) {
			$this->$key = $value;
		}
		$this->attributes = $attributes;
	}

	public static function attempt($email, $password)
	{
		foreach (config('users') as $user) {
			if ($user['email'] === $email && password_verify($password, $user['password'])) {
				return new self($user);
			}
		}
		return null;
	}

	public function getAuthIdentifierName() { return 'email'; }
	public function getAuthIdentifier() { return $this->attributes['email']; }
	public function getAuthPassword() { return $this->attributes['password']; }
	public function getRememberToken() { return null; }
	public function setRememberToken($value) {}
	public function getRememberTokenName() { return null; }
}

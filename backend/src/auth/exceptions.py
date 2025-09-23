class AuthDomainException(Exception):
    pass

class UserAlreadyExistsException(AuthDomainException):
    def __init__(self, username: str):
        self.username = username
        super().__init__(f"User '{username}' already exists")
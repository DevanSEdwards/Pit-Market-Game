from modules.create_deck import create_deck

def test_create_deck():
    assert create_deck(0) == ([],[])
    assert create_deck(2, 7, 6, 3) == ([6],[6])
    assert all([card in [2, 3, 4, 5, 6, 7, 8] for card in create_deck(18, 7, 6, 2)[0]])
    assert len(create_deck(973, 54, 23)[1]) == 486
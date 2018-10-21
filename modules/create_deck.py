from math import gcd
from random import shuffle


def create_deck(players, domain=7, mean=6, lower_limit=2):
    """
    Return a pair of value decks (lists) for sellers and buyers
    If the number of players is odd, give buyers one less card.

    @param players: Number of players (buyers + sellers). (>= 0)
    @param domain: Number of unique cards to be distributed in each deck.
        (> 0, default 7)
    @param mean: Number that the sellers deck will reflected around to
        generate the buyer's deck. (default 5)
    @param lower_limit: Lowest value card allowed. (default 2)

    @return sell_deck: A list of all seller cards.
    @return buy_deck: A list of all buyer cards.
    """
    sellers = (players + 1) // 2

    # Fill most of the sellers deck uniformly
    sell_deck = [
        i + lower_limit
        for j in range(sellers // domain)
        for i in range(domain)
    ]

    # 'Top up' the deck evenly, starting at the mean
    denominator = gcd(mean, domain)
    sell_deck += [
        (i * (mean - lower_limit) - j) % domain + lower_limit
        for j in range(denominator)
        for i in range(1, 1 - domain // denominator, -1)
    ][:sellers % domain]

    # Create a buy deck by reflecting the sell deck around the mean
    buy_deck = [2 * mean - i for i in sell_deck]
    # Remove the last card if the number of players is odd
    if players % 2 == 1:
        buy_deck = buy_deck[:-1]

    # Shuffle decks and return
    shuffle(sell_deck)
    shuffle(buy_deck)
    return sell_deck, buy_deck

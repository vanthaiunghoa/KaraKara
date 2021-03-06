## -*- coding: utf-8 -*-

import pytest

import urllib.parse

from . import with_settings


@pytest.mark.parametrize(('sub_path',), [
    (r'?keywords=hack%2F%2Fsign',),
    #(r'from%3Ahack%2F%2Fsign',),  # Pyramid traversal algorithum url.unquotes this and to my knowlege cannot be stopped. Bugger ... this can is mangled long before it gets to my view.
    (r'hack%2F%2Fsign',),
])
def test_track_list_urlencoding(app, queue, tracks, track_unicode_special, sub_path):
    """
    TODO: Need test to cover correct url encoding
    http://localhost:6543/search_tags/category%3Aanime/from%3Ahack%2F%2Fsign?
    http://localhost:6543/search_tags/category:anime/from:hack//sign?

    """
    url = f'/queue/{queue}/search_list/{sub_path}'
    response = app.get(url)
    assert 'UnicodeAssention'.lower() in response.text.lower()


def test_search_tags_with_unicode_flow(app, queue):
    keywords_unicode = urllib.parse.quote('Pokémon')
    response = app.get(f'/queue/{queue}/search_tags?keywords={keywords_unicode}')
    assert keywords_unicode in response.location


@pytest.mark.parametrize(('sub_path', 'expected_text', 'not_expected_text'), [
    ('/'                 , ['wildcard', 'track 1', 'track 2', 'track 3'], []),
    ('/?trackids=t1,t2'  , ['track 1', 'track 2']                       , ['track 3', 'wildcard', 'ここ']),
    ('/?keywords=test'   , ['track 1', 'track 2', 'track 3']            , ['wildcard']),
    (f'/?keywords={urllib.parse.quote("キ")}', ['track 3'], ['track 1', 'track 2', 'wildcard']),
    (f'/?keywords={urllib.parse.quote("Pokémon")}', [], ['track 1', 'track 2', 'track 3', 'wildcard']),
    #('/?keywords=Pok%E9mon', [], ['track 1', 'track 2', 'track 3', 'wildcard']), # reproduce https://github.com/Pylons/webob/issues/161 . put http://localhost:6543/queue/qtest/search_list?keywords=Pok%E9mon into your browser
    ('/anime'            , ['track 1', 'track 2']                       , ['wildcard', 'track 3']),
    ('/anime/en'         , ['track 2']                                  , ['wildcard', 'track 1', 'track 3']),
    ('/jpop'             , ['track 3', 'track 1']                       , ['wildcard', 'track 2']),
    ('/game'             , ['back']                                     , ['wildcard', 'track 1', 'track 2', 'track 3']),
    ('/monkeys1/monkeys2', ['back']                                     , ['wildcard', 'track 1', 'track 2', 'track 3']),
    ('/?keywords=monkeys', ['back']                                     , ['wildcard', 'track 1', 'track 2', 'track 3']),
    ('/?trackids=m1,m2'  , ['back']                                     , ['wildcard', 'track 1', 'track 2', 'track 3']),
])
def test_track_list(app, queue, tracks, sub_path, expected_text, not_expected_text):
    """
    The search list can be triggered with either:
      - a list of trackids
      - keyords to search
      - a set of tags to refine the search
    test with all these permutations and assert list of tracks returned
    By testing the HTML output we are also asserting the API throughput
    """
    response = app.get(f'/queue/{queue}/search_list/{sub_path}')
    response_text = response.text.lower()
    for text in expected_text:
        assert text.lower() in response_text
    for not_text in not_expected_text:
        assert not_text not in response_text


@pytest.mark.parametrize(('search_tags', 'in_sub_tags_allowed', 'not_in_sub_tags_allowed'), [
    ([]                     , ['category','lang','vocalstyle'] , []),
    (['en','anime']         , ['from']                         , ['category']),
    (['anime','en']         , ['vocalstyle']                   , ['category','lang']),
    (['jpop']               , ['from']                         , ['category','lang']),
    (['male']               , ['category','lang']              , ['vocalstyle']),
    (['monkeys1','monkeys2'], ['category','lang','vocalstyle'] , []),
])
def test_track_search_sub_tags_allowed(app, queue, tracks, search_tags, in_sub_tags_allowed, not_in_sub_tags_allowed):
    """
    We are specifically testing the 'sub_tags_allowed' code generation
    /search_list/ is based on /search/ and dose not incur the automatic redriection of /search_tags/
    """
    sub_path = '/'.join(search_tags)
    url = f'/queue/{queue}/search_list/{sub_path}?format=json'
    data = app.get(url).json['data']
    tags_allowed = data['sub_tags_allowed']
    for tag in in_sub_tags_allowed:
        assert tag in tags_allowed
    for tag in not_in_sub_tags_allowed:
        assert tag not in tags_allowed

@with_settings(settings={'karakara.search.list.threshold': 15})
@pytest.mark.parametrize(('search_tags', 'redirect_expected', 'expected_location'), [
    (['en']  , True , 'search_list'),  # 2 Tracks returned, that is less than threshold, redirect to list
    (['jp']  , True , 'track/t1'),  # Only one track should be returned, so redirect to single track view
    (['test'], False, 'search_tags')  # no redirect as more tracks than threshold
])
def test_search_tags_html_redirect(app, queue, tracks, tracks_volume, search_tags, redirect_expected, expected_location):
    """
    Test /search_tags/ endpoint
    search_tags has some special behaviour in html format
      - less than 15 tracks redirect view switch
      - single view redirect to track view
    """
    sub_path = '/'.join(search_tags)
    url = f'/queue/{queue}/search_tags/{sub_path}'
    response = app.get(url)
    if redirect_expected:
        assert response.status_code == 302
        response.follow()
        assert expected_location in response.location
    else:
        assert response.status_code == 200


@pytest.mark.parametrize(('search_tags', 'expected_tag_set'), [
    (['']                , set([('category:anime',2),('category:jpop',2),('lang:en',2),('lang:jp',1),('lang:fr',1)])),  # expected counts for base view
    (['category:anime']  , set([('from:series x',2)])),  # anime has 2 languages in it, but the subtags allowed forces 'from' # ,('lang:en',1),('lang:jp',1)
    (['vocalstyle:male'] , set([('category:anime',1),('category:jpop',1),('lang:jp',1),])),  # 1 in each category, they actually all point to the same single track
])
def test_search_tags_sub_tags(app, queue, tracks, tracks_volume, search_tags, expected_tag_set):
    """
    Sub tags (for browsing) have counts of the number of tracks under them
    test the correct tag counts
    This tests the API counts as format=html will redirect (see test above)
    """
    sub_path = '/'.join(search_tags)
    url = f'/queue/{queue}/search_tags/{sub_path}?format=json'
    data = app.get(url).json['data']
    tag_set = set([(tag['full'], tag['count']) for tag in data['sub_tags']])
    assert expected_tag_set <= tag_set


@pytest.mark.parametrize(('url_part',), [
    ('search_list/',),
    ('search_list/?keywords=test',),
    ('track/t1',),
])
def test_search_etag(app, queue, tracks, url_part):
    """
    Check the etags for 2 requests to the same section abort with etag
    """
    url = f'/queue/{queue}/{url_part}'
    response = app.get(url)
    etag = response.etag
    assert etag
    response = app.get(url, headers={'If-None-Match':etag})
    assert response.status_code == 304

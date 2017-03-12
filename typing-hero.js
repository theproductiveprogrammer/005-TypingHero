/** Typing Hero */

/**
 * https://youtu.be/U6XTjRpH398
 */

/**
 * As programmer, I've always
 * felt it didn't really matter
 * how fast I typed.
 */
/**
 * After all, I'm a problem
 * solver -a deep thinker,
 * a designer - not a code
 * monkey banging away at
 * the keyboard.
 */

/**
 * code-monkey.png
 */

/**
 * But is that really true? I
 * ran across a couple of blog
 * posts that really surprised
 * me. One from the great [href=https://blog.codinghorror.com/we-are-typists-first-programmers-second/](Jeff Atwood)
 * and the other from [href=http://steve-yegge.blogspot.in/2008/09/programmings-dirtiest-little-secret.html](Steve Yegge)
 * who is another of the giants
 * of our industry - and ... well
 * here's what they say in their
 * own words:
 *
 *  Steve Yegge: "[href=http://steve-yegge.blogspot.in/2008/09/programmings-dirtiest-little-secret.html](learn to fuckin' type)"
 *
 *  Jeff Atwood: "[href=https://blog.codinghorror.com/we-are-typists-first-programmers-second/](coding is just typing)"
 */

/**
 * The heart of the argument
 * here is that typing is the
 * primary interface between our
 * thoughts and the machine. We
 * ought to want to make this as
 * frictionless as possible. In
 * fact, I now think everyone
 * who uses a computer for more
 * than an hour a day ought to
 * learn to type.
 *
 * So to be a great programmer
 * we need to train our fingers
 * to blur across a smoking
 * keyboard at 80 WPM!
 *
 * Ok I'm down with that. I
 * threw together a [href=/th/typing-hero.html](quick check)
 * to see how fast I am now and
 * built it out into a small
 * game to help improve anyone's
 * typing practice.
 */

/**
 * You can check how good, bad,
 * or ugly your typing speed is
 * by playing [href=/th/typing-hero.html](Typing Hero) and
 * saving stories from being
 * eaten by the Mundane Monster:
 */

/**
 * mundane-monster.png [href=/th/typing-hero.html]
 */

/**
 * The code for this game, as
 * always, follows below. Drop a
 * comment with your opinion of
 * the code in the comment box
 * below.
 */

/**
 * The Typing Hero Game
 */

/**
 * [!] We need to check the
 * user's current speed and help
 * him practice so he can get
 * faster.
 *
 * [+] Programmers aren't
 * typists and don't like to
 * type so let's make it fun and
 * simple.
 *
 * [+] Pick a nice story for the
 * user to type out accurately
 * then count and report the
 * words-per-minute.
 *
 * [+] Next, we scroll the text
 * at the user's WPM speed to
 * build practice.
 *
 * [+] For each further stage we
 * increase the speed to keep
 * the game challenging.
 */

/**
 * [->] We load all the stories
 * into the page rather than
 * picking them up from the
 * server. In order to keep the
 * size manageable, we will use
 * the excellent string
 * comparison library [href=http://pieroxy.net/blog/pages/lz-string/index.html](lz-string)
 * [->] At the start of a game
 * we will install a keyboard
 * handler and a timer for
 * scrolling. These are
 * uninstalled at the end of the
 * game.
 * [->] All modules will use and
 * act upon a common game state.
 * The game state will contain
 * the story, the user input,
 * the game parameters, the
 * state of play, and the user
 * history/score.
 * [->] Updates will happen via
 * a central 'update' function
 * that accepts state changes
 * and distributes them to the
 * various modules. This is
 * essentially the core of the [href=https://facebook.github.io/react/](React)
 * architecture without the
 * _Virtual DOM_ (given we have
 * a handful of DOM nodes to be
 * updated - diffing should have
 * no performance impact).
 * [->] Errors will be reported
 * to the user via an alert box.
 * It will then redirect back to
 * this post with an error
 * parameter so that users can
 * report any problems/suggestions.
 */

/**
 * [=] We load the a new game
 * level and start the play.
 */
function begin() {
    start(new_game());
}

/* [typ] GAME STATES */
var GAME_IS_WAITING="WAITING";
var GAME_IS_TRAINING_L1="TRAINING_L1";
var GAME_IS_TRAINING_L2="TRAINING_L2";
var GAME_IS_PLAYING="PLAYING";
var GAME_IS_PAUSED="PAUSED";
var GAME_IS_WON="WON";
var GAME_IS_LOST="LOST";
var GAME_IS_TIMEOUT="TIMEOUT";

/**
 * [=] Create a brand new game
 * [ ] Set the game state and
 * the starting user level and WPM.
 * [ ] Pick a short story
 * [ ] Set starting game
 * parameters
 */
function new_game() {
    var game = {
        uid: random_uid(),
        state: GAME_IS_WAITING,
        story: random_short_story(),
    };

    game.parameters = starting_game_parameters_1(game);

    return game;
}

/**
 * [=] Increase the level of the
 * game and return a new
 * challenge.
 * [ ] Pick a new story and
 * level up the game parameters.
 */
function new_game_level_up(oldgame) {
    var game = {
        uid: oldgame.uid,
        state: GAME_IS_WAITING,
        story: pick_random_story(),
    };

    game.parameters = level_up_game_parameters_1(oldgame);

    return game;
}

/*
 * [=] Start the game at the
 * same level.
 * [ ] Make a copy of the
 * existing game and return it.
 */
function new_game_same_level(oldgame) {
    var game = {
        uid: oldgame.uid,
        state: GAME_IS_WAITING,
        story: oldgame.story,
    };

    game.parameters = oldgame.parameters;

    return game;
}

/* [!] Generate a random user id
 * [+] We don't need the id to
 * be really random, just enough
 * to distinguish most users
 * from each other.
 * [ ] Use Math.random to
 * generate a number between
 * 1000 and 100000
 */
function random_uid() {
  return Math.floor(Math.random() * (100000 - 1000)) + 1000;
}

/*
 * [!] Return a random short
 * story
 * [+] STORIES contain all the
 * stories compressed along with
 * their original lengths.
 * [+] Filter for stories with
 * length < 150 words and pick a
 * random one from them.
 */
function random_short_story() {

    var get_short_stories = function(stories) {
        var filtered = [];
        for(var i = 0;i < stories.length;i++) {
            var story = stories[i];
            if(story && story.length < 150) filtered.push(story);
        }
        if(filtered.length == 0) return stories; /* no short stories found */
        return filtered;
    }

    return pick_random_story(get_short_stories);
}

/**
 * [!] Return a random story
 * from the global STORIES list
 * [!] We also want to sometimes
 * add a criteria for the
 * stories (such as returning
 * only short stories).
 * [+] Find the unused stories
 * and filter by any conditions
 * required.
 * [+] Pick one at random. The
 * stories are compressed so
 * decompress them before
 * returning.
 */
function pick_random_story(filter) {

    var get_unused = function(stories) {
        var unused = [];
        for(var i = 0;i < stories.length;i++) {
            var story = stories[i];
            if(story && !story.used) unused.push(story);
        }
        /* if we can't find any
         * unused stories, reset
         * the 'used' setting
         * and return them all */
        if(unused.length == 0) {
            for(var i = 0;i < stories.length;i++) {
                var story = stories[i];
                if(story) story.used = false;
                unused.push(story);
            }
        }
        return unused;
    }

    var filtered = get_unused(STORIES);
    if(filter) {
        filtered = filter(filtered);
    }

    var random_ndx = Math.floor(Math.random()*filtered.length);
    var story = filtered[random_ndx];

    story.used = true;
    return LZString.decompressFromBase64(story.text);
}


/**
 * [!] Set the starting game parameters
 * [+] The game starts by
 * keeping the WPM at a low 30
 * and scrolling only after the
 * first few characters so the
 * user understands what needs
 * to be done.
 * [+] If the accuracy drops
 * below a certain limit (60),
 * we decide the user has failed
 * and stop.
 */
function starting_game_parameters_1(game) {
    return {
        scroll_point: 5,
        target_wpm: 20,
        min_accuracy: 60,
    }
}

/*
 * [=] Return a level harder
 * game parameters.
 * [ ] Now that the user has
 * finished a level, he should
 * know what to do so we don't
 * allow errors and set the
 * scroll point to the
 * beginning (the game starts
 * scrolling as soon as the user
 * types).
 * [ ] We up the target speed
 * slightly to push him to be faster.
 * [ ] We decrease the number
 * of allowed mistakes.
 */
function level_up_game_parameters_1(game) {
    var target_wpm = game.parameters.target_wpm + 2;
    var min_accuracy = game.parameters.min_accuracy + 2;

    /* we're all human - allow some mistakes */
    if(min_accuracy > 90) min_accuracy = 90;

    return {
        scroll_point: 0,
        scroll_stop_on_error: 0,

        target_wpm: target_wpm,
        min_accuracy: min_accuracy,
    }
}

/**
 * [=] Start the game
 * [ ] Install the keyboard
 * handler
 * [ ] Start up the timer
 * [ ] Start the game update
 * loop
 */
function start(game) {
    if(!install_kb_handler(game, gotkey)) {
        onerror("Failed to install keyboard handler!", "0x11");
        return;
    }
    start_timer(game, ontick);
    update(game, { state: GAME_IS_TRAINING_L1 });
}

/**
 * [=] Stop the game
 * [ ] Uninstall the keyboard
 * handler
 * [ ] Stop the timer
 */
function end(game) {
    if("uninstall_kb_handler" in game && "stop_timer" in game) {
        game.uninstall_kb_handler(game);
        game.stop_timer(game);
    } else {
        onerror("Unexpected error on game end!", "0x765");
    }
}

/**
 * [=] Handle a user keypress
 * [+] The user has started
 * playing and is doing one of
 * three things:
 *   (a) Typing a character
 *   (b) Erasing a character (Backspace)
 *   (c) Stopping the game (Escape)
 * [+] We will also keep track
 * of the time so we know the
 * user timings of entry.
 */
function gotkey(game, key) {

    if(key == "ESC") {
        update_special_key_1(game, key);
    } else if(key == "BACKSPACE") {
        erase_last_character_1(game);
    } else {
        update_user_text_1(game, key);
    }
}
function erase_last_character_1(game) {
    var user_text = game.user_text ? game.user_text : "";
    var len = user_text.length;

    if(!len) return;

    len -= 1;
    user_text = user_text.substring(0,len);
    update(game, { user_text: user_text });
}
function update_user_text_1(game, key) {
    var user_text = game.user_text ? game.user_text : "";
    user_text = user_text + key;
    update(game, { user_text: user_text });
}

function update_special_key_1(game, key) {
    update(game, { special_key: key })
}

/**
 * [=] Set typing times
 * [ ] Imagine keeping an
 * array of all times of entry
 * to calculate the WPM and
 * timeouts.
 * [ ] Because this is
 * inefficient we keep track
 * of only the first and
 * last entry times and this
 * turns out to be enough for
 * the rest of the system.
 */
function track_keypress_times(game) {
    var time = Date.now();
    if(!game.first_user_keypress) {
        game.first_user_keypress = time;
    }
    game.last_user_keypress = time;
}
function reset_keypress_times(game) {
    game.first_user_keypress = undefined;
    game.last_user_keypress = undefined;
}


/*
 * [=] Launch a timer that ticks
 * at a regular rate.
 * [...]
 * We also save the stop_timer
 * function to clear this timer
 * into our game object.
 */
function start_timer(game, callback) {
    var timer = setInterval(function(){
        callback(game);
    }, 200);

    game.stop_timer = function () {
        clearInterval(timer);
    }
}

/**
 * [=] Do timing events
 * [ ] Handle heartbeat
 * [ ] Handle user timeouts
 * [ ] Handle WPM scrolling
 * [ ] Handle show cute msgs
 */
function ontick(game) {
    var now = new Date();
    handle_heartbeat_1(game, now);
    handle_user_timeouts_1(game, now);
    handle_wpm_scrolling_1(game, now);
    handle_show_cute_msgs_1(game, now);
}

/*
 * [=] Handle a 'heartbeat'
 * that keeps the game updating
 * itself even without user
 * input.
 */
function handle_heartbeat_1(game, now) {
    if(!game.last_heartbeat) {
        game.last_heartbeat = now;
        return;
    }

    var diff = now - game.last_heartbeat;
    var heartbeat = diff > 500;

    if(heartbeat) {
        game.last_heartbeat = now;
        update(game, { timer_event_heartbeat: true });
    }
}

/*
 * [=] Handle user timeouts
 * [ ] If the user has been idle
 * for more than a minute,
 * timeout and restart the game.
 */
function handle_user_timeouts_1(game, now) {

    var diff = now - game.last_user_keypress;
    var timeout = function() {
        /* NB: diff can be NaN because
         * game.last_user_keypress may not be
         * set. In this case, we will not
         * timeout. */
        return diff > 60000;
    }

    if(timeout()) {
        update(game, { timer_event_timeout: true });
    }
}

/**
 * [!] We would like to motivate
 * the user to keep going.
 * [+] We will UNLEASH A SCROLL
 * MONSTER that eats up the
 * story at the target WPM.
 * [ ] At a given speed "WPM",
 * the monster eats a word
 * every 1/WPM minutes or a
 * character every 1/5*WPM
 * minutes.
 * [ ] In milliseconds that is:
 *      = 60000/5*WPM
 * [ ] If the typist types
 * faster than the target WPM,
 * we maintain chase after him
 * maintaining a short offset.
 *
 * [...]
 * We maintain an offset so the
 * user has time and breathing
 * space to adjust the flow of
 * typing.
 */
function handle_wpm_scrolling_1(game, now) {
    if(!game.is_scrolling) return;

    var cond_typist_running_fast = function(eat) {
        return game.accuracy_params.matched_till &&
            (game.accuracy_params.matched_till - eat > TARGET_DISPLAY_OFFSET);
    }

    var eat;
    if(isNaN(game.eaten_till)) {
        eat = -TARGET_DISPLAY_OFFSET;
    } else {
        eat = game.eaten_till;
    }

    if(cond_typist_running_fast(eat)) {
        eat = game.accuracy_params.matched_till - TARGET_DISPLAY_OFFSET;
    } else {
        if(!game.last_eaten_time) game.last_eaten_time = now;

        var eat_every = 60000/(5*game.parameters.target_wpm);
        var interval = now - game.last_eaten_time;

        if(interval > eat_every) {
            game.last_eaten_time = now;
            eat += 1;
        }
    }

    update(game, { eaten_till: eat });
}

/*
 * [=] Show the user encouraging
 * messages to keep them
 * motivated.
 * [ ] Check every 3 seconds,
 * and if the WPM is "good enough"
 * (> 40) pick and show a cute
 * message to encourage the user
 * to keep going.
 * [ ] Notify the update system
 * so they can show the user the
 * cute message.
 */
var CUTE_MSGS = [ "Keep going!", "DUDE!",
    "Awesome!", "Go Baby!", "Faster!",
    "Good job", "Nice!" ];
function handle_show_cute_msgs_1(game, now) {
    if(!game.last_cute_msg) return;

    var diff = now - game.last_cute_msg;
    var time_for_msg = diff > (8 * 1000);

    var get_random_msg_1 = function() {
        var random_ndx = Math.floor(Math.random()*CUTE_MSGS.length);
        return CUTE_MSGS[random_ndx];
    }

    if(time_for_msg) {
        var good_enough = 40;
        if(game.wpm > good_enough) {
            game.last_cute_msg = now;
            update(game, { cute_msg: get_random_msg_1() });
        }
    }

}
/* [=] Reset the cute message
 * timer
 */
function start_cute_msg_timer(game) {
    game.last_cute_msg = new Date();
}

/**
 * [=] The update loop scheduler
 * [+] The update is queued out
 * of the current flow so it
 * gets called after the flow
 * completes.
 * [...] If the update contains
 * the same values as the game,
 * nothing happens (idempotent).
 */
function update(game, upd) {

    upd = remove_unchanged_updates_1(game, upd);
    if(Object.keys(upd).length == 0) return;

    setTimeout(function() {
        do_update_1(game, upd);
    });
}

/**
 * [=] The main update loop
 * [+] Update the game based on
 * it's current state and then
 * show the updated game.
 */
function do_update_1(game, upd) {
    if(game.state == GAME_IS_WAITING) {
        update_while_waiting_1(game, upd);
    } else if(game.state == GAME_IS_TRAINING_L1) {
        update_while_training1_1(game, upd);
    } else if(game.state == GAME_IS_TRAINING_L2) {
        update_while_training2_1(game, upd);
    } else if(game.state == GAME_IS_PLAYING) {
        update_while_playing_1(game, upd);
    } else if(game.state == GAME_IS_PAUSED) {
        update_while_paused_1(game, upd);
    } else if(game.state == GAME_IS_WON) {
        update_while_won_1(game, upd);
    } else if(game.state == GAME_IS_LOST) {
        update_while_lost_1(game, upd);
    } else if(game.state == GAME_IS_TIMEOUT) {
        update_while_timeout_1(game, upd);
    } else {
        onerror("Unexpected state error!\n", "0x99:" + game.state);
    }

    show_game(game);
}

function remove_unchanged_updates_1(game, upd) {
    var ret = {};
    walk_object_keys(upd, function(key) {
        if(upd[key] != game[key]) {
            ret[key] = upd[key];
        }
    });
    return ret;
}

/* [=] Helper function to walk
 * the enumerable keys that
 * belong to this object
 */
function walk_object_keys(obj, fn) {
    var keys = Object.keys(obj);
    for(var i = 0;i < keys.length;i++) {
        fn(keys[i]);
    }
}

/* [=] Handle updates to game
 * state when waiting.
 * [+] The only update we expect
 * to get at this time is that
 * the game has started (some
 * state change).
 */
function update_while_waiting_1(game, upd) {
    if(!upd.state) {
        onerror("Unexpected update while wating!\n", "0x51");
    }
    update_game_state(game, upd.state);
}

/* [=] Handle updates to game
 * state when training.
 * [ ] When we first enter this
 * state, we set the target text.
 * [ ] Ignore timeouts and wait
 * patiently
 * [ ] We handle ESC as a pause
 * key.
 * [ ] If the user has updated
 * text handle the new text.
 */
function update_while_training1_1(game, upd) {
    walk_object_keys(upd, function(key) {
        if(key == "timer_event_timeout") {
            /* ignore */
        } else if(key == "timer_event_heartbeat") {
            /* ignore */
        } else if(key == "special_key" && upd[key] == "ESC") {
            game.prev_state = GAME_IS_TRAINING_L1;
            update(game, { state: GAME_IS_PAUSED });
        } else if(key == "state_changed") {
            set_target_text_while_training1_1(game);
        } else if(key == "user_text") {
            update_user_text_while_training1_1(game, upd);
        } else if(key == "state") {
            update_game_state(game, upd.state);
        } else {
            onerror("Unexpected update in training1", "0x52:" + key);
        }
    });
}

/* [=] Handle update to game
 * state when training (level 2).
 * [ ] In order to be more
 * forgiving and usable, when
 * the user times-out, we stop
 * keeping track of the WPM.
 * [ ] We handle ESC as a pause
 * key.
 * [ ] Once the user enters
 * text we handle the new text
 * and track the WPM.
 * [ ] As we enter this state,
 * we set the target text to be
 * displayed and switch on the
 * entire game view.
 * [ ] We should not be in this
 * stage for long but even if we
 * are we are going to ignore
 * any cute messages 
 */
function update_while_training2_1(game, upd) {
    walk_object_keys(upd, function(key) {
        if(key == "timer_event_timeout") {
            reset_keypress_times();
            if(game.accuracy_params) {
                game.paused_at = game.accuracy_params.matched_till;
            }
        } else if(key == "timer_event_heartbeat") {
            update_running_wpm(game);
        } else if(key == "cute_msg") {
            /* ignore */
        } else if(key == "special_key" && upd[key] == "ESC") {
            game.prev_state = GAME_IS_TRAINING_L2;
            update(game, { state: GAME_IS_PAUSED });
        } else if(key == "state_changed") {
            switch_on(game);
            set_target_text_while_training2_1(game);
        } else if(key == "user_text") {
            track_keypress_times(game);
            update_user_text_while_training2_1(game, upd);
        } else if(key == "state") {
            update_game_state(game, upd.state);
        } else {
            onerror("Unexpected update in training2", "0x53:" + key);
        }
    });
}

/* [=] Handle update to game
 * state when playing.
 * [ ] On a timeout, move to a
 * timeout state.
 * [ ] We handle ESC as a pause
 * key.
 * [ ] Once the user enters
 * text we handle the new text
 * and update the WPM.
 * [ ] As we enter this state,
 * we turn on the scrolling so
 * the text starts to move.
 * [ ] As we get eaten messages
 * we update the target text.
 * [ ] To keep the user
 * motivated, we occasionally
 * show cute messages.
 */
function update_while_playing_1(game, upd) {
    walk_object_keys(upd, function(key) {
        if(key == "timer_event_timeout") {
            update(game, { state: GAME_IS_TIMEOUT });
        } else if(key == "timer_event_heartbeat") {
            update_running_wpm(game);
        } else if(key == "cute_msg") {
            show_short_message(upd[key]);
        } else if(key == "special_key" && upd[key] == "ESC") {
            game.prev_state = GAME_IS_PLAYING;
            update(game, { state: GAME_IS_PAUSED });
        } else if(key == "state_changed") {
            start_cute_msg_timer(game);
            game.is_scrolling = true;
        } else if(key == "user_text") {
            track_keypress_times(game);
            update_user_text_while_playing_1(game, upd);
            set_game_win_loose_1(game);
        } else if(key == "eaten_till") {
            update_eaten_till_1(game, upd);
            set_game_win_loose_1(game);
        } else if(key == "state") {
            game.is_scrolling = false;
            update_game_state(game, upd.state);
        } else {
            onerror("Unexpected update while playing", "0x54:" + key);
        }
    });
}

/* [=] Handle update to game
 * state when playing.
 * [ ] Ignore everything except
 * an ESC key to switch to the
 * previous state again.
 * [ ] When entering this state,
 * show the state message so the
 * user knows we are paused.
 */
function update_while_paused_1(game, upd) {
    walk_object_keys(upd, function(key) {
        if(key == "special_key" && upd[key] == "ESC") {
            update(game, { state: game.prev_state });
        } else if(key == "state_changed") {
            reset_keypress_times(game);
            if(game.accuracy_params) {
                game.paused_at = game.accuracy_params.matched_till;
            }
            show_paused_message_1(game);
        } else if(key == "state") {
            hide_state_message();
            update_game_state(game, upd.state);
        }
    });
}

/* [=] Handle updates to game
 * state when user has won.
 * [ ] Show the user a
 * congratulations message.
 * [ ] When the user clicks the
 * "next level" button we level
 * up and play the next game.
 */
function update_while_won_1(game, upd) {
    walk_object_keys(upd, function(key) {
        if(key == "state_changed") {
            end(game);
            show_won_message_1(game);
        } else if(key == "click" && upd[key] == "level_up") {
            hide_state_message();
            start(new_game_level_up(game));
        }
    });
}

/* [=] Handle updates to game
 * state when user has won.
 * [ ] Show the user a
 * 'try again' message and let
 * him try again.
 */
function update_while_lost_1(game, upd) {
    walk_object_keys(upd, function(key) {
        if(key == "state_changed") {
            end(game);
            show_lost_message_1(game);
        } else if(key == "click" && upd[key] == "try_again") {
            hide_state_message();
            start(new_game_same_level(game));
        }
    });
}

/* [=] Handle updates to game
 * state when user has
 * timed-out.
 * [ ] Show the user a
 * 'try again' message and let
 * him try again.
 */
function update_while_timeout_1(game, upd) {
    walk_object_keys(upd, function(key) {
        if(key == "state_changed") {
            end(game);
            show_timeout_message_1(game);
        } else if(key == "click" && upd[key] == "try_again") {
            hide_state_message();
            start(new_game_same_level(game));
        }
    });
}

/* [=] Update the WPM based
 * on the current running time
 */
function update_running_wpm(game) {
    var chars_ok = game.accuracy_params.matched_till;
    if(game.paused_at) chars_ok -= game.paused_at;
    game.wpm = calculate_wpm(game.first_user_keypress,
                                new Date(),
                                chars_ok);
}
function show_paused_message_1(game) {
    var state = "GAME PAUSED";

    var a = document.createElement('a');
    a.innerHTML = "Resume (ESC)"
    a.onclick = function() {
        update(game, { state: game.prev_state });
    };

    show_state_message(game, state, a);
}
function show_won_message_1(game) {
    var state = "LEVEL COMPLETED!";

    var a = document.createElement('a');
    a.innerHTML = "Get Better"
    a.onclick = function() {
        update(game, { click: "level_up" });
    };

    show_state_message(game, state, a);
}
function show_lost_message_1(game) {
    var state = "LEVEL FAILED!";

    var a = document.createElement('a');
    a.innerHTML = "Try Again"
    a.onclick = function() {
        update(game, { click: "try_again" });
    };

    show_state_message(game, state, a);
}
function show_timeout_message_1(game) {
    var state = "TIMEOUT!";

    var a = document.createElement('a');
    a.innerHTML = "Try Again"
    a.onclick = function() {
        update(game, { click: "try_again" });
    };

    show_state_message(game, state, a);
}

/* [=] Whenever we update the
 * game state, we also send a
 * 'state_changed' message so
 * the new state can do any
 * setup it wants.
 */
function update_game_state(game, state) {
    game.state = state;
    update(game, { state_changed: true });
}

var TARGET_DISPLAY_OFFSET = 5;
var TARGET_DISPLAY_SIZE = 10;

/* [=] Set the target text to
 * what is left for the user to
 * type in.
 */
function set_target_text_while_training2_1(game) {
    game.target = {
        padding: pad(TARGET_DISPLAY_OFFSET),
        matched: [0,1],
        display: [1,TARGET_DISPLAY_SIZE - TARGET_DISPLAY_OFFSET],
    };
}

/* [=] Set the target text as
 * the first character.
 * [ ] Set the padding to "full"
 * target offset.
 * [ ] Set nothing as matched
 * yet
 * [ ] Set display as first
 * character.
 */
function set_target_text_while_training1_1(game) {
    game.target = {
        padding: pad(TARGET_DISPLAY_OFFSET),
        matched: [0,0],
        display: [0,1],
    };
}

/* [=] Return a space padded string
 * of the given size
 */
function pad(num) {
    if(num > 0) {
        return new Array(num+1).join(" ");
    }
    return "";
}


var SND_KEY = new Audio("key.mp3");
var SND_ERR = new Audio("err.mp3");
/* [=] Handle update to user
 * text when in first phase of
 * training.
 * [ ] Recalculate the
 * accuracy parameters.
 * [ ] If the user has added
 * text, check if the last text
 * added is matching. If it is
 * the user can move onto
 * training session 2,
 * otherwise play a "error"
 * sound.
 * [ ] If the character entered
 * is lowercase, message the
 * user with a hint.
 */
function update_user_text_while_training1_1(game, upd) {
    game.accuracy_params = calculate_accuracy_params(game.story, upd.user_text);

    if(game.user_text && game.user_text.length > upd.user_text.length) {
        /* no new text - backspace pressed */
        game.user_text = upd.user_text;
        return;
    }

    game.user_text = upd.user_text;

    var last_char_ndx = upd.user_text.length - 1;
    if(game.accuracy_params.extra.indexOf(last_char_ndx) > -1) {
        /* last character is extra - does not match anything */
        SND_ERR.play();
        if(upd.user_text[last_char_ndx] == game.story[0].toLowerCase()) {
            show_short_message("Capital-" + game.story[0]);
        }
    } else {
        send_user_to_training2_1(game);
    }
}

/* [=] Handle update to user
 * text when in second phase of
 * training.
 * [ ] Recalculate the accuracy
 * parameters.
 * [ ] Update the target text.
 * [ ] Play the typewriter or
 * error sound depending on the
 * last character entered by the
 * user.
 * [ ] When the user reaches the
 * 'scroll point' training is
 * over and we move to playing
 * the game.
 */
function update_user_text_while_training2_1(game, upd) {
    game.accuracy_params = calculate_accuracy_params(game.story, upd.user_text);

    update_target_text_while_training2_1(game);
    game.progress = calculate_progress(game.story, game.accuracy_params.matched_till);
    var chars_ok = game.accuracy_params.matched_till;
    if(game.paused_at) chars_ok -= game.paused_at;
    game.wpm = calculate_wpm(game.first_user_keypress,
                                game.last_user_keypress,
                                chars_ok);

    if(game.user_text && game.user_text.length > upd.user_text.length) {
        /* no new text - backspace pressed */
        game.user_text = upd.user_text;
        return;
    }

    game.user_text = upd.user_text;

    var last_char_ndx = upd.user_text.length - 1;
    if(game.accuracy_params.extra.indexOf(last_char_ndx) > -1) {
        /* last character is extra - does not match anything */
        SND_ERR.play();
    } else {
        SND_KEY.play();
    }

    if(game.accuracy_params.matched_till > game.parameters.scroll_point) {
        update(game, { state: GAME_IS_PLAYING });
    }
}

/* [=] Handle update to user
 * text while playing.
 * [ ] Recalculate the accuracy
 * parameters.
 * [ ] Update the target text.
 * [ ] Play the typewriter or
 * error sound depending on the
 * last character entered by the
 * user.
 */
function update_user_text_while_playing_1(game, upd) {
    game.accuracy_params = calculate_accuracy_params(game.story, upd.user_text);

    update_target_text_while_playing_1(game);
    game.progress = calculate_progress(game.story, game.accuracy_params.matched_till);
    var chars_ok = game.accuracy_params.matched_till;
    if(game.paused_at) chars_ok -= game.paused_at;
    game.wpm = calculate_wpm(game.first_user_keypress,
                                game.last_user_keypress,
                                chars_ok);

    if(game.user_text && game.user_text.length > upd.user_text.length) {
        /* no new text - backspace pressed */
        game.user_text = upd.user_text;
        return;
    }

    game.user_text = upd.user_text;

    var last_char_ndx = upd.user_text.length - 1;
    if(game.accuracy_params.extra.indexOf(last_char_ndx) > -1) {
        /* last character is extra - does not match anything */
        SND_ERR.play();
    } else {
        SND_KEY.play();
    }
}

/* [=] Set the game's win/loose
 * status
 * [ ] When the user reaches the
 * end before the monster he has
 * won. Otherwise he looses.
 * [ ] When the user's accuracy
 * drops below a limit he
 * looses. We check accuracy
 * after the user has completed
 * at least ten words otherwise
 * it's too unstable.
 */
function set_game_win_loose_1(game) {
    if(game.accuracy_params.matched_till >= game.story.length) {
        update(game, { state: GAME_IS_WON });
    }

    if(game.eaten_till >= game.story.length) {
        update(game, { state: GAME_IS_LOST });
    }

    if(game.accuracy_params.accuracy < game.parameters.min_accuracy) {
        var user_typing_stable = game.user_text && game.user_text.length > 50;
        if(user_typing_stable) {
            update(game, { state: GAME_IS_LOST });
        }
    }
}

/* [=] Get the target for the
 * training text.
 * [+] We set a part of the
 * unmatched story as the
 * display text. The amount to
 * display is:
 *  display size - offset
 * [+] If the matched portion is
 * less than 'offset', we pad
 * the remaining.
 */
function update_target_text_while_training2_1(game) {
    var disp_start = game.accuracy_params.matched_till;
    var disp_end = disp_start + (TARGET_DISPLAY_SIZE - TARGET_DISPLAY_OFFSET);
    if(disp_end > game.story.length) disp_end = game.story.length;

    var padding;
    var matched_start;
    if(disp_start < TARGET_DISPLAY_OFFSET) {
        padding = pad(TARGET_DISPLAY_OFFSET - disp_start);
        matched_start = 0;
    } else {
        padding = 0;
        matched_start = disp_start - TARGET_DISPLAY_OFFSET;
    }

    game.target = {
        padding: padding,
        matched: [matched_start,disp_start],
        display: [disp_start, disp_end],
    };
}

/* [=] Get the current target
 * the user is playing for.
 * [+] If the monster has eaten
 * more than has been matched we
 * don't show the indicator and
 * just show the uneaten part as
 * unmatched.
 * [+] We set a part of the
 * unmatched story as the
 * display text. The amount to
 * display is:
 *  display size - offset
 * [+] If the unmatched story is
 * eaten, we don't show it.
 * [+] If the matched portion is
 * less than 'offset', we pad
 * the remaining.
 */
function update_target_text_while_playing_1(game) {

    if(game.eaten_till > game.accuracy_params.matched_till) {
        game.target = {
            no_indicator: true,
            padding: "",
            matched: [0,0],
            display: [game.eaten_till,
                      game.eaten_till + TARGET_DISPLAY_SIZE],
        }
        return;
    }

    var disp_start = game.accuracy_params.matched_till;
    var pfx = disp_start - game.eaten_till;
    var matched_start;
    var disp_end;
    if(pfx > TARGET_DISPLAY_OFFSET) {
        disp_end = disp_start + (TARGET_DISPLAY_SIZE - TARGET_DISPLAY_OFFSET);
        if(disp_end > game.story.length) disp_end = game.story.length;
        if(game.eaten_till < 0) {
            matched_start = 0;
            padding = pad(-game.eaten_till);
        } else {
            matched_start = game.eaten_till;
            padding = "";
        }
    } else {
        matched_start = game.eaten_till;
        disp_end = disp_start + (TARGET_DISPLAY_SIZE - pfx);
        if(disp_end > game.story.length) disp_end = game.story.length;
        padding = "";
    }

    game.target = {
        padding: padding,
        matched: [matched_start,disp_start],
        display: [disp_start, disp_end],
    };
}

/* [=] Update the eaten till
 * [+] And also the target text
 * to reflect the eating
 */
function update_eaten_till_1(game, upd) {
    game.eaten_till = upd.eaten_till;
    update_target_text_while_playing_1(game, upd);
}

/* [=] Calculate the WPM
 */
function calculate_wpm(time_start, time_end, chars_typed_ok) {
    if(!time_start || !time_end || !chars_typed_ok) return 0;

    var time_taken = time_end - time_start;
    var mins = time_taken/60000;

    /* adjust for jittering in
     * pause/resume */
    if(mins < 0.1) mins = 0.1;

    var words = chars_typed_ok/5;

    return Math.floor(words/mins);
}

/* [=] Calculate the progress in
 * percentage
 */
function calculate_progress(story, done_till) {
    if(!story || !done_till) return 0;

    var tgt = story.length;

    if(tgt == done_till) return 100;

    return Math.floor((done_till*100)/tgt);
}


/* [=] Send user to the next
 * training session after
 * clearing his mistakes.
 * [...] Also play a nice
 * typwriter sound.
 */
function send_user_to_training2_1(game) {
    SND_KEY.play();
    game.user_text = game.user_text.substr(game.user_text.length-1);
    game.accuracy_params = calculate_accuracy_params(game.story, game.user_text);
    update(game, { state: GAME_IS_TRAINING_L2 });
}

/**
 * [!] Calculate the accuracy of
 * a user's entry (how close
 * she is to her target text).
 * [+] Walk the user
 * input and match it to the
 * story to find out what has
 * been matched.
 * [+] If the user input does
 * not match, perhaps the user
 * has mistakenly hit a key and
 * moved ahead. If so, we will
 * add that key to the 'extra'
 * list and move on.
 * [+] Another case for the user
 * input to not match is if the
 * user has missed typing some
 * characters. We will look ahead
 * and see - if the next four
 * characters match we assume
 * this is the case and move
 * ahead. We add these
 * characters to the 'missed' list.
 * [+] Calculate the accuracy as
 * the total characters typed,
 * less the number of missed
 * characters and errors
 * expressed as a percentage.
 */
function calculate_accuracy_params(target, text) {
    var len = text ? text.length : 0;
    var match_ndx = 0;

    var direct_match = function(text, i, target, ndx) {
        return text[i] == target[ndx];
    }

    var has_missed = function(text, i, target, ndx) {
        if((len - i) < 4) return false;

        var maybe_match = function(lookahead) {
            var la = ndx + lookahead;
            return text[i] == target[la] &&
                    text[i+1] == target[la+1] &&
                    text[i+2] == target[la+2] &&
                    text[i+3] == target[la+3];
        }

        /* Try skipping up to 10 characters */
        for(var skip = 1;skip < 10;skip++) {
            if(maybe_match(skip)) return skip;
        }

        return 0;
    }

    var missed = [];
    var extra = [];
    for(var i = 0;i < len;i++) {
        if(direct_match(text,i,target,match_ndx)) {
            match_ndx += 1;
        } else {
            var skip = has_missed(text,i,target,match_ndx);
            if(skip) {
                for(var s = 0;s < skip;s++) {
                    missed.push(match_ndx);
                    match_ndx += 1;
                }
                match_ndx += 1;
            } else {
                extra.push(i);
            }
        }
    }

    var correct = len - missed.length - extra.length;
    var accuracy = Math.floor((correct / len)*100);

    return { accuracy: accuracy,
             matched_till: match_ndx,
             missed: missed,
             extra: extra };
}

/**
 * [=] Show the current game
 * [ ] Mark the user text entry
 * with extras and show it.
 * [ ] Mark and slice the story
 * into a target for the user
 * and show it.
 * [ ] Show the accuracy and WPM
 * [ ] If there is a
 * 'debug-story' element, dump
 * the game there so we can see
 * it and aid debugging.
 */
function show_game(game) {
    var s = document.getElementById('debug-story');
    if(s) {
        s.innerHTML = JSON.stringify(game,null,2);
    }

    show_user_text(user_text_1(game));
    show_target(game.story, game.target);
    if(game.accuracy_params) show_accuracy(game.accuracy_params.accuracy);
    show_wpm(game.wpm);
    show_progress_bar(game.progress);
}

/* [=] Get a display-able user
 * text.
 * [ ] Mark any extra characters
 * the user has entered with
 * "th-extra" class for display.
 */
function user_text_1(game) {
    var extra;
    if(game.accuracy_params) {
        extra = game.accuracy_params.extra;
    }
    return mark_characters_in_html(game.user_text, extra, "th-extra");
}

/* [=] Marks the given points in
 * a string with the given
 * classname.
 * [ ] Walk user text character
 * by character
 * [ ] HTML-escape the character
 * [ ] If the character is
 * extra, mark it by surrounding
 * with <span>.
 */
function mark_characters_in_html(str, marks, classname) {
    if(!str) return "";
    if(!marks) return str;

    var is_marked_1 = function(ndx) {
        return marks.indexOf(ndx) != -1;
    }

    var ret = "";
    for(var i = 0;i < str.length;i++) {
        var c = html_escape(str[i]);
        var is_marked = marks.indexOf(i) != -1
        if(is_marked) {
            ret += "<span class=th-extra>"+c+"</span>";
        } else {
            ret += c;
        }
    }

    return ret;
}

/* [=] Make text html safe
 */
function html_escape(c) {
    if(c == "&") return "&amp;";
    if(c == "<") return "&lt;";
    if(c == ">") return "&gt;";
    if(c == "\"") return "&quot;";
    if(c == "'") return "&#039;";;
    return c;
}

/**
 * [!] Install a keyboard
 * handler
 * [+] Use a method supported by
 * the browser to install the keyboard
 * handler wrapped so that it
 * accepts valid key presses.
 * [+] Add the corresponding
 * uninstall method so we can
 * detach the handler when needed.
 */
function install_kb_handler(game, handler) {
    var b = document.body;

    /**
     * [=] Give the handler
     * ascii keys it can handle
     * rather than events.
     * [= -] The 'Space' key
     * also causes the browser
     * to scroll the window. As
     * we need the space to type
     * we disable this
     * behaviour.
     */
    var keyhandler = function(e) {
        var k = to_key(e);
        if(k) {
            handler(game, k);
            if(k == " ") e.preventDefault();
        }
    };

    if(b.addEventListener) {
        b.addEventListener("keydown", keyhandler);
        game.uninstall_kb_handler = function() {
            b.removeEventListener("keydown", keyhandler);
        };
        return true;
    }

    if(b.attachEvent) {
        b.attachEvent("onkeydown", keyhandler);
        game.uninstall_kb_handler = function () {
            b.detachEvent("onkeydown", keyhandler);
        }
        return true;
    }

    return false;
}

/**
 * [!] Convert the keyboard
 * event into a key.
 * [+] Get the event and the
 * associated keycode.
 * [+] Use a mapping to convert
 * the keycode into a key. The
 * mapping is taken from the
 * amazing [href=https://github.com/dmauro/Keypress](dmauro/Keypress)
 * (we only map type-able keys).
 * [+] If the shift key is
 * pressed, convert the key to
 * the "shifted" version
 * otherwise just return the
 * found key.
 */
function to_key(e) {
    e = e ? e : window.event;
    var c = e.keyCode ? e.keyCode : e.key;

    var key = keycode_map[c];
    if(!key) return null;

    if(e.shiftKey) {
        var shiftkey = keycode_shifted[key];
        if(shiftkey) return shiftkey;
    }

    return key;
}
var keycode_shifted = {
    "/"     : "?",
    "."     : ">",
    ","     : "<",
    "\'"    : "\"",
    ";"     : ":",
    "["     : "{",
    "]"     : "}",
    "\\"    : "|",
    "`"     : "~",
    "="     : "+",
    "-"     : "_",
    "1"     : "!",
    "2"     : "@",
    "3"     : "#",
    "4"     : "$",
    "5"     : "%",
    "6"     : "^",
    "7"     : "&",
    "8"     : "*",
    "9"     : "(",
    "0"     : ")",
    "a"     : "A",
    "b"     : "B",
    "c"     : "C",
    "d"     : "D",
    "e"     : "E",
    "f"     : "F",
    "g"     : "G",
    "h"     : "H",
    "i"     : "I",
    "j"     : "J",
    "k"     : "K",
    "l"     : "L",
    "m"     : "M",
    "n"     : "N",
    "o"     : "O",
    "p"     : "P",
    "q"     : "Q",
    "r"     : "R",
    "s"     : "S",
    "t"     : "T",
    "u"     : "U",
    "v"     : "V",
    "w"     : "W",
    "x"     : "X",
    "y"     : "Y",
    "z"     : "Z",
};
var keycode_map = {

    8   : "BACKSPACE",
    13  : "\n",
    27  : "ESC",

    32  : " ",
    48  : "0",
    49  : "1",
    50  : "2",
    51  : "3",
    52  : "4",
    53  : "5",
    54  : "6",
    55  : "7",
    56  : "8",
    57  : "9",
    65  : "a",
    66  : "b",
    67  : "c",
    68  : "d",
    69  : "e",
    70  : "f",
    71  : "g",
    72  : "h",
    73  : "i",
    74  : "j",
    75  : "k",
    76  : "l",
    77  : "m",
    78  : "n",
    79  : "o",
    80  : "p",
    81  : "q",
    82  : "r",
    83  : "s",
    84  : "t",
    85  : "u",
    86  : "v",
    87  : "w",
    88  : "x",
    89  : "y",
    90  : "z",
    96  : "0",
    97  : "1",
    98  : "2",
    99  : "3",
    100 : "4",
    101 : "5",
    102 : "6",
    103 : "7",
    104 : "8",
    105 : "9",
    106 : "*",
    107 : "+",
    108 : "\n",
    109 : "-",
    110 : ".",
    111 : "/" ,
    186 : ";",
    187 : "=",
    188 : ",",
    189 : "-",
    190 : ".",
    191 : "/",
    192 : "`",
    219 : "[",
    220 : "\\",
    221 : "]",
    222 : "\'",
    223 : "`",
    // Firefox weirdness
    59 : ";",
    61 : "=",
    173 : "-",
};

/**
 * [=] Error handling
 * [+] Show alert box for error
 * and redirect to this post
 */
function onerror(msg,errcode) {
    msg += "\n\nPlease report this error to the developer.";
    msg += "\nYou will be redirected to a blog where you can leave a comment. Thanks!";
    alert(msg);
    window.location.href = "/typing-hero.js.php?err=" + errcode;
}

/**
 * [=] Load a function after
 * the browser DOM is ready.
 * [+] We use the code from [href=https://jquery.com/](JQuery)
 * to handle various browser
 * inconsistencies.
 * [+] First we check if the
 * DOM is already set up before
 * we've started, then we try
 * the DOMContentLoaded event
 * and fallback to the
 * window.onload event.
 * [+] Our callback may be fired
 * multiple times (because
 * onload can trigger multiple
 * times and both
 * DOMContentLoaded and onload
 * may be supported) so we need
 * to check that too.
 */
function when_browser_ready(callback) {

    var browser_already_ready = function() {
        return document.readyState === "complete" ||
            (document.readyState !== "loading" && !document.documentElement.doScroll);
    }

    if (browser_already_ready()) {
        callback();
        return;
    }

    var called = false;
    var onready = function() {
        if(called) return;
        called = true;
        callback();
    }

    if(document.addEventListener) {
        document.addEventListener("DOMContentLoaded", onready, false);
        window.addEventListener("load", onready, false);
        return;
    }

    if(window.attachEvent) {
        window.attachEvent("onload", onready);
        return;
    }
}

/**
 * UI Functions
 */

/**
 * [=] Show the accuracy as a
 * series of colored lights.
 * [ ] Get the number of lit
 * lights based on the accuracy,
 * the color of the lights based
 * on the number and show the
 * lights and accuracy text.
 */
function show_accuracy(a) {

    var num = get_num_lit_lights_1(a);
    var get_colored_light = colored_lights_gen_1(num);

    var acc = get_empty_accuracy_div_1();

    show_accuracy_lights_1(acc, num, get_colored_light);
    show_accuracy_text_1(acc, a);
}

function show_accuracy_text_1(acc, a) {
    var txt = document.createElement('div');
    if(a == 0) {
        txt.innerHTML = "Accuracy";
    } else {
        txt.innerHTML = "Accuracy(" + a + "%)";
    }
    acc.appendChild(txt);
}

/* [=] Show a band of 6 lights
 * and light up the number
 * required.
 */
function show_accuracy_lights_1(acc, num, get_colored_light) {
    for(var i = 0;i < num;i++) {
        acc.appendChild(get_colored_light());
    }

    var remaining = 6 - num;
    for(var i = 0;i < remaining;i++) {
        acc.appendChild(get_blank_img_1());
    }
}

function get_empty_accuracy_div_1() {
    var acc = document.getElementById('th-accuracy');
    acc.innerHTML = "";
    return acc;
}

/* [!] The light band should
 * be lit with different colors
 * depending on how many lights
 * are on to give the user an
 * immediate visual indication
 * of "doing well" or "doing
 * badly".
 * [+] When the lights are few,
 * we light them with RED to
 * warn the user.
 * [+] Mid-level is blue, and
 * high accuracy is green.
 * [+] When there is nothing
 * going on show all blank
 * lights.
 */
function colored_lights_gen_1(num) {
    if(num == 0) return get_blank_img_1;
    if(num < 3) return get_red_img_1;
    if(num < 5) return get_blue_img_1;
    if(num < 7) return get_green_img_1;

    console.log('Should never reach here!');
    return get_blank_img_1; /* error case */
}

/*
 * [!] Indicate to the user if
 * his/her accuracy is good or
 * bad.
 * [+] Return the number of
 * lights to glow based on the
 * accuracy of the user.
 * [+] The user should keep
 * accuracy close to 100% for
 * typing speed to be a sensible
 * measure. Lower than 85% is
 * terrible.
 */
function get_num_lit_lights_1(a) {
    if(a == 0) return 0;
    if(a < 85) return 1;
    if(a < 90) return 2;
    if(a < 94) return 3;
    if(a < 97) return 4;
    if(a < 100) return 5;
    return 6;
}

/*
 * [=] Return a new image
 * element with the given source
 */
function new_image_element(src) {
    if(!src) return;
    var img = new Image();
    img.src = src;
    return img;
}
function get_blank_img_1() {
    return new_image_element("th-light-blank.png");
}
function get_red_img_1() {
    return new_image_element("th-light-red.png");
}
function get_blue_img_1() {
    return new_image_element("th-light-blue.png");
}
function get_green_img_1() {
    return new_image_element("th-light-green.png");
}

/**
 * [=] Show the WPM speed as a
 * progress bar.
 * [ ] Convert the WPM to a
 * percent of the bar and show
 * it.
 * [ ] Show WPM as text also
 */
function show_wpm(w) {
    var percent = wpm_to_percent_1(w);

    show_wpm_progress_bar_1(percent);
    show_wpm_progress_bar_text_1(w);
}

function show_wpm_progress_bar_text_1(w) {
    var txt = document.getElementById('th-wpm-bar-label');
    if(w) {
        txt.innerHTML = w + " WPM";
    } else {
        txt.innerHTML = "WPM";
    }
}

function show_wpm_progress_bar_1(percent) {
    var bar = document.getElementById('th-wpm-bar');
    var progress = document.getElementById('th-wpm-progress');

    progress.style.width = (100 - percent) + "%";
    bar.style.backgroundColor = get_wpm_color_1(percent);
}

function get_wpm_color_1(percent) {
    if(percent > 80) return "purple";
    if(percent > 65) return "green";
    if(percent > 50) return "blue";
    if(percent == 0) return "white";
    return "red";
}

/*
 * [!] Convert the WPM to a
 * percentage scale.
 * [+] An excellent WPM would be
 * in the high 90's while a poor
 * WPM would be in the 30's.
 * For a programmer a WPM in the
 * 50's is good. Therefore we
 * scale the WPM on a scale of
 * 80 as the high end we are
 * interested in.
 * [+] An empty bar is
 * represented with a WPM of 0.
 * [+] If a WPM is below 2, we
 * keep it at 2 so it can be
 * seen by the user.
 */
function wpm_to_percent_1(w) {
    if(!w) return 0;
    if(w > 80) return 100;
    if(w < 2) return 2;
    return (w * 100) / 80;
}

function show_progress_bar(progress) {
    var left = 100-progress;

    var sz = 512;
    sz = 512 * (left/100);

    var bar = document.getElementById('th-left');
    bar.style.width = sz;
}

/* [!] When starting we want to
 * start with a mostly empty screen
 * to focus the user's attention
 * on what's important. Then we
 * want to 'switch on' all the
 * interface.
 * [+] We show the backgrounds,
 * the top and bottom
 * indicators, the monster, and
 * the amount left indicator.
 */
function switch_on() {
    show_background_1();
    show_top_1();
    show_bottom_1();
    show_arena_background_1();
    show_monster_1();
    show_left_1();
}
function show_background_1(url) {
    return restore_background_image('th-bg', 'th-background.png');
}
function show_arena_background_1(url) {
    return restore_background_image('th-arena', 'th-rocks.png');
}
function restore_background_image(id, url) {
    var background = document.getElementById(id);
    if(!background) return;
    background.style.backgroundImage = "url("+url+")";
}
function show_top_1() {
    show_dom_element('th-top');
}
function show_bottom_1() {
    show_dom_element('th-bottom');
}
function show_monster_1() {
    show_dom_element('th-monster');
}
function show_left_1() {
    show_dom_element('th-left');
}
function show_dom_element(id) {
    var elem = document.getElementById(id);
    if(!elem) return;
    elem.style.visibility = "visible";
}

/**
 * [!] We would like to "talk"
 * with the user and give some
 * short messages.
 * [+] Show the message and then
 * fade it out.
 * [ ] We set the message text,
 * fade out, then clear the text
 * after it's invisible.
 */
function show_short_message(msg) {
    var m = document.getElementById('th-msg');
    m.innerHTML = html_escape(msg);

    fade_out(m, function() {
        m.innerHTML = "";
    });
}

/*
 * [=] Fade out a DOM element
 * [ ] We gradually decrease the
 * opacity to get a simple,
 * linear fade out.
 * [ ] We use a timer rather
 * than requestAnimationFrame
 * because it is better
 * supported and the fade is too
 * simple to worry about minor
 * jittering.
 * [ ] Once the fade is
 * complete, we call the
 * continuation to let the
 * caller do what they want.
 */
function fade_out(elem, then) {
    var opacity = 1;
    var timer = setInterval(function() {
        if(opacity <= 0.1) {
            clearInterval(timer);
            then();
        } else {
            elem.style.opacity = opacity;
            elem.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
            opacity -= opacity * 0.1;
        }
    }, 50);
}

/* [=] Show the user text
 */
function show_user_text(txt) {
    var e = document.getElementById('th-user');
    e.innerHTML = txt;
}

/* [!] Show the target text and
 * the indicator.
 * [+] The target text consists
 * of padding, a matched block,
 * and an unmatched block from
 * the story.
 * [+] The indicator has to
 * start at the beginning of the
 * unmatched block. For this, to
 * line up we set the entire
 * padding and matched block in
 * the indicator and then turn
 * it invisible leaving only the
 * indicator visible.
 */
function show_target(story, tgt) {
    if(!tgt) return;

    var matched = '<span class=th-matched>';
    matched += tgt.padding;
    matched += html_escape(story.substring(tgt.matched[0], tgt.matched[1]));
    matched += '</span>';

    var display = html_escape(story.substring(tgt.display[0], tgt.display[1]));

    var target = document.getElementById('th-target');
    target.innerHTML = matched + display;

    var indicator = document.getElementById('th-indicator');
    if(tgt.no_indicator) {
        indicator.innerHTML = "";
    } else {
        indicator.innerHTML = '<span class=th-spacing>'+matched+'</span>_';
    }
}

/* [!] Show the user the status
 * of the game while in play
 * [+] Overlay the game and show
 * a state message.
 * [+] The message contains a
 * button with an action (which
 * is an link DOM element) which
 * calls a function to move
 * forward.
 */
function show_state_message(game, state, action) {
    show_state_message_overlay_1();
    show_state_message_box_1();
    show_state_message_tweet_1(game);
    show_state_message_msg_1(state);
    show_state_message_btn_1(action);
    show_story_so_far_1(game);
}
function hide_state_message() {
    hide_state_message_overlay_1();
    hide_state_message_box_1();
    hide_state_message_tweet_1();
    hide_state_message_msg_1();
    hide_state_message_btn_1();
    hide_story_so_far_1();
}

function hide_story_so_far_1() {
    var m = document.getElementById('th-story-so-far');
    m.innerHTML = "";
    m.style.display = "none";
}

function show_story_so_far_1(game) {
    var extra;
    if(game.accuracy_params) {
        extra = game.accuracy_params.extra;
    }
    var story = mark_characters_in_html(game.user_text, extra, "th-extra");
    if(!story) return;

    var m = document.getElementById('th-story-so-far');
    m.innerHTML = story;

    var sz_w = 512;
    var l = (document.documentElement.clientWidth - sz_w)/2;

    var prev = document.getElementById('th-state-msg');
    var offset = prev.getBoundingClientRect();
    var t = offset.bottom + 3;
    m.style.top = t + "px";
    m.style.left = l + "px";
    m.style.display = "block";
}

function hide_state_message_btn_1() {
    var m = document.getElementById('th-msg-btn-txt');
    m.innerHTML = "RESTART";
}
function show_state_message_btn_1(btn) {
    var sz_w = 128;
    var sz_h = 28;
    /* get rough position */
    var t = (document.documentElement.clientHeight - sz_h)/2;
    var l = (document.documentElement.clientWidth - sz_w)/2;
    /* adjust postion to just how we like it */
    t -= 9;
    var m = document.getElementById('th-msg-btn');
    m.style.top = t + "px";
    m.style.left = l + "px";
    m.style.width = sz_w + "px";
    m.style.height = sz_h + "px";

    show_state_message_btn_txt_1(m, btn);
}

function show_state_message_btn_txt_1(btn, a) {
    var m = document.getElementById('th-msg-btn-txt');
    m.innerHTML = "";
    m.appendChild(a);

    var sz_w = m.clientWidth;
    var sz_h = m.clientHeight;
    /* get rough position */
    var t = (btn.clientHeight - sz_h)/2;
    var l = (btn.clientWidth - sz_w)/2;
    /* adjust postion to just how we like it */
    t += 2;
    var offset = btn.getBoundingClientRect();
    m.style.top = (t + offset.top) + "px";
    m.style.left = (l + offset.left) + "px";
}

function hide_state_message_msg_1() {
    var m = document.getElementById('th-msg-txt');
    m.innerHTML = "";
}
function show_state_message_msg_1(state) {
    var m = document.getElementById('th-msg-txt');
    m.innerHTML = html_escape(state);

    var sz_w = m.clientWidth;
    var sz_h = m.clientHeight;
    /* get rough position */
    var t = (document.documentElement.clientHeight - sz_h)/2;
    var l = (document.documentElement.clientWidth - sz_w)/2;
    /* adjust postion to just how we like it */
    t -= 64;
    m.style.top = t + "px";
    m.style.left = l + "px";
}

function hide_state_message_tweet_1() {
    var m1 = document.getElementById('th-tweet-title');
    m1.innerHTML = "";
    var m2 = document.getElementById('th-tweet-btn');
    m2.innerHTML = "";
    var m3 = document.getElementById('th-tweet-txt');
    m3.innerHTML = "";
}
function show_state_message_tweet_1(game) {
    var sz_w = 300;
    var sz_h = 78;
    /* get rough position */
    var t = (document.documentElement.clientHeight - sz_h)/2;
    var l = (document.documentElement.clientWidth - sz_w)/2;
    /* adjust postion to just how we like it */
    t -= 135;
    var m = document.getElementById('th-tweet');
    m.style.top = t + "px";
    m.style.left = l + "px";
    m.style.width = sz_w + "px";
    m.style.height = sz_h + "px";

    var stats = get_tweet_stats_1(game);
    var share_txt = "My speed typing stats: " + stats;

    show_state_message_tweet_title_1(m, "Typing Hero");
    show_state_message_tweet_msg_1(m, stats);
    load_tweet_percentile_1(m, game);
}
function get_tweet_stats_1(game) {
    if(game.accuracy_params) {
        return "WPM: " + game.wpm +
            ", Accuracy: " + game.accuracy_params.accuracy + "%";
    } else {
        return "WPM: Unknown, Accuracy: Unknown";
    }
}

function show_state_message_tweet_msg_1(tweet, msg) {
    var m = document.getElementById('th-tweet-txt');
    var htm = html_escape(msg);
    m.innerHTML = htm;

    position_message_text_nicely_in_tweet_box(tweet, m);
}

function show_state_message_tweet_title_1(tweet, title) {
    var m = document.getElementById('th-tweet-title');
    m.innerHTML = title;

    var sz_h = m.clientHeight;
    var sz_w = m.clientWidth;
    var t = 10;
    var l = (tweet.clientWidth - sz_w)/2;
    var offset = tweet.getBoundingClientRect();
    m.style.top = (t + offset.top) + "px";
    m.style.left = (l + offset.left) + "px";
}

/* [=] Load the tweet percentile
 * from the server 
 */
function load_tweet_percentile_1(m, game) {
    get_percentile_from_server(game.wpm,
        game.accuracy_params.accuracy,
        game.state,
        game.uid,
        function(wpm, accuracy, state, percentile) {
            show_tweet_percentile_1(m, wpm, accuracy, state, percentile);
        });
}

/* [=] Make an ajax call to get
 * the percentile from the
 * server.
 */
function get_percentile_from_server(wpm, accuracy, state, uid, callback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            if(xmlhttp.status != 200) {
                console.log('Error getting percentile! ' + xmlhttp.responseText);
                callback(wpm, accuracy, state, 0);
            }
            else {
                var percentile = parseInt(xmlhttp.responseText);
                if(percentile > 0 && percentile < 100) {
                    callback(wpm, accuracy, state, percentile);
                } else {
                    callback(wpm, accuracy, state, 0);
                }
            }
        }
    }

    xmlhttp.open("POST", "/th/percentile.php", true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    var url = "wpm=" + encodeURIComponent(wpm);
    url += "&accuracy=" + encodeURIComponent(accuracy);
    url += "&state=" + encodeURIComponent(state);
    url += "&uid=" + encodeURIComponent(uid);
    xmlhttp.send(url);
}

function show_tweet_percentile_1(cont, wpm, accuracy, state, percentile) {
    var msg = get_msg_for_percentile_1(state, percentile);
    var tweet = get_tweet_for_percentile_1(wpm, accuracy, state, percentile);

    show_state_message_tweet_btn_1(tweet);

    var m = document.getElementById('th-tweet-txt');
    m.innerHTML += "<br><b><i>" + msg + "</i></b>";

    position_message_text_nicely_in_tweet_box(cont, m);
}

/* [=] Position the tweet
 * message nicely in the tweet
 * box.
 */
function position_message_text_nicely_in_tweet_box(box, msg) {
    var offset = box.getBoundingClientRect();
    var sz_h = msg.clientHeight;
    /* leave a little space (10) for margin */
    var t = offset.bottom - 10 - sz_h;
    var l = offset.left + 10;

    msg.style.top = t + "px";
    msg.style.left = l + "px";
}

function get_msg_for_percentile_1(state, percentile) {
    if(!percentile || percentile < 20) return "";
    if(state != GAME_IS_WON) {
        return "You're in the " +
                num_ordinal_suffix(percentile) + " percentile so far.";
    }
    if(percentile < 50) {
        return "Pretty good! You're in the " +
                num_ordinal_suffix(percentile) + " percentile!";
    }
    if(percentile < 60) {
        return "Above average! You're in the " +
                num_ordinal_suffix(percentile) + " percentile!";
    }
    if(percentile < 80) {
        return "You're pretty good! You're in the " +
                num_ordinal_suffix(percentile) + " percentile!";
    }
    if(percentile < 95) {
        return "Man - you're good! You're in the " +
                num_ordinal_suffix(percentile) + " percentile!";
    }
    return "Wowza! You're in the " +
        num_ordinal_suffix(percentile) + " percentile!";
}
function get_tweet_for_percentile_1(wpm, accuracy, state, percentile) {
    wpm = wpm ? wpm : "Unknown";
    accuracy = accuracy ? accuracy : "Unknown";
    var msg;
    if(state == GAME_IS_PAUSED || state == GAME_IS_TIMEOUT) {
        msg = "Playing Typing Hero!";
    } else {
        msg = "Played Typing Hero!";
    }
    if(percentile && percentile > 20) {
        msg += " I speed type in the " +
                num_ordinal_suffix(percentile) + " percentile!"
    } else {
        msg += " My speed typing stats -";
    }
    msg += " (WPM: " + wpm + ", Accuracy: " + accuracy + ")";
    return msg;
}

/* [=] Return the ordinal-
 * suffixed number
 * [ ] The teens are a special
 * case of ordinals. Otherwise
 * the ordinals are based simply
 * on the last digit.
 */
function num_ordinal_suffix(n) {
    if(n > 3 && n < 20) return n + "th";
    var last_digit = n % 10;
    if(last_digit == 1) return n + "st";
    if(last_digit == 2) return n + "nd";
    if(last_digit == 3) return n + "rd";
    return n + "th";
}

function show_state_message_tweet_btn_1(tweet) {
    var m = document.getElementById('th-tweet-btn');
    var cont = document.getElementById('th-tweet');

    var sz_w = 61;
    var sz_h = 20;
    var offset = cont.getBoundingClientRect();
    /* leave a little space (10) for margin */
    var t = offset.top + 10;
    var l = offset.right - sz_w - 10;
    m.style.top = t + "px";
    m.style.left = l + "px";

    appendchild_tweet_btn_1(m, tweet);
}

function appendchild_tweet_btn_1(m, tweetable) {
    var btn = document.createElement('a');
    btn.setAttribute('href', 'http://twitter.com/share');
    btn.setAttribute('class', 'twitter-share-button twitter-tweet');
    btn.setAttribute('data-text', html_escape(tweetable));
    btn.setAttribute('data-url', 'http://theproductiveprogrammer.blog/th/typing-hero.html');
    btn.innerHTML = 'Tweet';

    m.appendChild(btn);

    if(twttr && twttr.widgets) twttr.widgets.load();
}

function show_state_message_box_1() {
    var sz_w = 900;
    var sz_h = 411;

    var t = (document.documentElement.clientHeight - sz_h)/2;
    var l = (document.documentElement.clientWidth - sz_w)/2;

    var m = document.getElementById('th-state-msg');
    m.style.top = t + "px";
    m.style.left = l + "px";
    m.style.width = sz_w + "px";
    m.style.height = sz_h + "px";
    m.style.backgroundImage = "url(\"state-msg.png\")";

    m.style.display = "block";
}
function hide_state_message_box_1() {
    var m = document.getElementById('th-state-msg');
    m.style.display = "none";
}

function show_state_message_overlay_1() {
    var o = document.getElementById('th-overlay');
    o.style.width = "100%";
}
function hide_state_message_overlay_1() {
    var o = document.getElementById('th-overlay');
    o.style.width = "0";
}


/**
 * Entry point
 */
when_browser_ready(begin);

/* TODO
 * [ ] Remove "magic numbers"
 * [ ] Replace string[] with
 * string.charAt
 */


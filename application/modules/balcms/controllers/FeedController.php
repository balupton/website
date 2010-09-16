<?php
require_once 'Zend/Controller/Action.php';
class Balcms_FeedController extends Zend_Controller_Action {
	
	/**
	 * Initialise our Controller
	 */
	public function init() {
		# Disable Rendering
		$this->getHelper('layout')->disableLayout();
		$this->getHelper('viewRenderer')->setNoRender(true);
	}
	
	/**
	 * Generate our Feed
	 */
	protected function getFeed() {
		# Prepare
		$App = $this->getHelper('App');
		$Identity = $App->getUser();
		
		# --------------------------
		# Fetch Content
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		
		# Prepare Criteria
		$criteria = array(
			'recent' => true,
			'fetch' => 'list',
			'status' => 'published',
			'Identity' => $Identity,
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Criteria: SearchQuery
		if ( $searchQuery ) {
			$criteria['search'] = $searchQuery;
		}
		
		# Fetch
		$Contents = $App->fetchRecords('Content',$criteria);
		
		# --------------------------
		# Generate Feed
		
		# Pepare Feed
		$feed = array(
			'title' => $App->getConfig('bal.site.title'),
			'link' => $App->getBaseUrl(true),
			'dateModified' => empty($Content[0]) ? time() : strtotime($Content->updated_at),
			'description' => $App->getConfig('bal.site.description', 'News Feed for '.$App->getConfig('bal.site.title'))
		);
		
		# Create Feed
		$Feed = new Zend_Feed_Writer_Feed;
		$Feed->setTitle($feed['title']);
		$Feed->setLink($feed['link']);
		$Feed->setDateModified($feed['dateModified']);
		$Feed->setDescription($feed['description']);
		
		# Content Map
		$map = array(
			'title' => 'title',
			'url' => 'link',
			'updated_at' => 'dateModified',
			'created_at' => 'dateCreated',
			'description_rendered' => 'description',
			'content_rendered' => 'content'
		);
		
		# Apply Content
		foreach ( $Contents as $Content ) {
			# Create Entry
            $Entry = $Feed->createEntry();

			# Prepare Content
			$Content['url'] = $App->getUrl()->content($Content)->full()->toString();
			$Content['updated_at'] = strtotime($Content['updated_at']);
			$Content['created_at'] = strtotime($Content['created_at']);
			
			# Apply Content
            foreach ( $map as $from => $to ) {
                $method = 'set'.ucfirst($to);
				$value = delve($Content,$from);
                $Entry->$method($value);
            }

			# Add Entry
            $Feed->addEntry($Entry);
		}
		
		# --------------------------
		# Done
		
		# Return Feed
		return $Feed;
	}
	
	/**
	 * Display the RSS Feed
	 */
	public function rssAction() {
		# Prepare
		$App = $this->getHelper('App');
		
		# --------------------------
		# Fetch Content
		
		# Prepare
		$Feed = $this->getFeed();
		$Feed->setFeedLink($App->getUrl()->route('feed')->controller('feed')->action('rss')->full()->toString(), 'rss');
		
		# Output
		echo $Feed->export('rss');
	}
	
	/**
	 * Display the Atom Feed
	 */
	public function atomAction() {
		# Prepare
		$App = $this->getHelper('App');
		
		# --------------------------
		# Fetch Content
		
		# Fetch Author
		$author = $App->getConfig('bal.site.author');
		
		# Prepare
		$Feed = $this->getFeed();
		$Feed->addAuthor($author['title'], $author['email'], $author['url']);
		$Feed->setFeedLink($App->getUrl()->route('feed')->controller('feed')->action('atom')->full()->toString(), 'atom');
		
		# Output
		echo $Feed->export('atom');
	}

}


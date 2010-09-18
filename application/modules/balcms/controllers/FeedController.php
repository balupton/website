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
	protected function getFeed($type=null) {
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
			'author' => $App->getConfig('bal.site.author'),
			'dateModified' => empty($Content[0]) ? time() : strtotime($Content->updated_at),
			'description' => $App->getConfig('bal.site.description', 'News Feed for '.$App->getConfig('bal.site.title')),
			'categories' => prepare_csv_array($App->getConfig('bal.site.keywords'))
		);
		
		# Create Feed
		$Feed = new Zend_Feed_Writer_Feed;
		$Feed->setTitle($feed['title']);
		$Feed->setLink($feed['link']);
		$Feed->setDateModified($feed['dateModified']);
		$Feed->setDescription($feed['description']);
		$Feed->addAuthor($feed['author']['title'], $feed['author']['email'], $feed['author']['url']);
		$Feed->addHub('http://pubsubhubbub.appspot.com/');
		
		# Apply Categories
		$categories = array();
		foreach ( $feed['categories'] as $tag ) {
			$categories[] = array('term'=>str_replace(' ','-',$tag),'label'=>$tag);
		}
		$Feed->addCategories($categories);
		
		# Content Map
		$contentMap = array(
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
            foreach ( $contentMap as $from => $to ) {
                $method = 'set'.ucfirst($to);
				$value = delve($Content,$from);
                $Entry->$method($value);
            }

			# Apply Author
			if ( empty($Content['Author']['website']) ) {
				$Content['Author']['website'] = $App->getUrl()->user($Content['Author'])->full()->toString();
			}
			$Entry->addAuthor($Content['Author']['displayname'], $Content['Author']['email'], $Content['Author']['website']);
			
			# Apply Categories
			$categories = array();
			foreach ( $Content['ContentTags'] as $Tag ) {
				$categories[] = array('term'=>str_replace(' ','-',$Tag['name']),'label'=>$Tag['name']);
			}
			$Entry->addCategories($categories);
			
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
		$Feed = $this->getFeed('rss');
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
		
		# Prepare
		$Feed = $this->getFeed('atom');
		$Feed->setFeedLink($App->getUrl()->route('feed')->controller('feed')->action('atom')->full()->toString(), 'atom');
		
		# Output
		echo $Feed->export('atom');
	}

}

